import express from "express";
import path from "path";
import * as fs from "node:fs";
import multer from "multer";

// Change this to the directory loaded as usercode, set it to test-usercode for testing purposes
let user_dir_name = "/usrcode";
let user_code_dir = user_dir_name;
if (process.env.IS_DOCKER_CONTAINER !== "true") {
  user_dir_name = "./testUsr";
  user_code_dir = path.resolve(user_dir_name);
  console.log("this is the path resolve" + user_code_dir);
}

import { createServer } from "node:http";
import { Server } from "socket.io";

import crypto from "crypto";
import session from "express-session";

import { getStatus, testfn } from "../usrcode/test.js";

import cors from "cors";

//import {setupCanvas} from './server/canvas.js';
import { get_client } from "./server/database/connect-db.js";
import { debug_set_env, get_source_paths } from "./server/util.js";

import { Game, GameState } from "./server-core/game.js";

import { loadScene } from "./server-core/scene-operations.js";

// used for saving/loading scenes
import ESSerializer from "esserializer";

//for emitting to sockets in other files so we need to set io
//import { registerSocketEvents } from "./server-core/socketEvents.js";

// import {} from '../usrcode/test.js';

const app = express();
const port = process.env.PORT || 3000;

const code = "testUsr"; // temp will need to change this to /usrcode

debug_set_env();

// const flask = "http://127.0.0.1/app/2/"

// import {fork} from 'node:child_process';
// const server_process = fork('./server-core/server.js');

const editors = [];

app.use(express.static("static"));
app.use("/static", express.static("static"));
//app.use("/user-static", express.static(user_code_dir + "/resources"));

app.use(express.json()); // This allows to parse json requests

const sessionMiddleware = session({
  secret: crypto.randomBytes(64).toString("hex"),
  resave: true,
  saveUninitialized: true,
});


//for socket update from editor
const pendingSceneUpdates = new Map(); // Store pending updates by object ID
let sceneUpdateTimer = 100;

app.use(sessionMiddleware);

app.use(cors({ origin: "http://localhost:5173" }));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//registerSocketEvents(io);
io.engine.use(sessionMiddleware);

const game = new Game(io);
//this is temporary fix for testing development
//app.use(cors({ origin: "http://localhost" }));
//app.use(cors({ origin: "http://localhost" }));

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await fetch("http://127.0.0.1:5000/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      req.user = data;
      next();
    } else {
      const errorData = await response.json();
      return res.status(401).json({ message: errorData.message });
    }
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// watch files in the user's code directory to update editor
fs.watch(user_code_dir, { recursive: true }, () => {
  sendFilesToSockets();
});

function sendFilesToSockets() {
  const getFilesFlat = (dirPath) => {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    let files = [];
    items.forEach((item) => {
      const itemPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        files = files.concat(getFilesFlat(itemPath)); // Recursively add files
      } else {
        files.push(itemPath); // Add file path
      }
    });
    return files;
  };

  try {
    const files = getFilesFlat(code); // Get all files as a flat list

    // update all connected editors
    editors.forEach((editor) => {
      io.to(editor).emit("files_update", files);
    });
  } catch (error) {
    console.error("Error reading folder:", error);
  }
}


async function loadSceneFromGame(game){
  try{
    console.log("game.active_scene: ", game.active_scene);
    const fullPath = path.join(user_code_dir,"scenes", game.active_scene)
    const scene = await loadScene(fullPath)
    return scene
  }
  catch (error){
    console.error("error loading scene", error)
    return null
  }
}

import { testScenes } from "./tests/testscenes.js";
import { testpong } from "./tests/testpong.js";
app.get("/tests/", (req, res) => {
  testScenes();
  testpong();
  // for (const player of game.players) {
  //     console.log("testing set scene")
  //     io.to(player).emit('set_scene', "./files/scenes/testscene2.scene");
  // }

  res.send("Tests complete");
});

app.get("/old-root", (req, res) => {
  let testhtml = "";
  try {
    testhtml = fs.readFileSync("./test.html", "utf8"); // Text content of the file
  } catch (err) {
    console.error("An error occurred:", err);
    res.send("error");
    return;
  }

  const userjs = getStatus.toString();
  let msg = testfn();
  let script = setupCanvas.toString() + "\nsetupCanvas();";

  testhtml = testhtml.replace("{{ msg }}", testfn());
  testhtml = testhtml.replace("{{ script }}", script);

  res.send(testhtml);
});

app.get("/test/:inputnum", (req, res) => {
  let msg = testfn();
  res.send(
    "hello from container, " +
      msg +
      " <br> param: " +
      req.params.inputnum +
      " <br> query: " +
      req.query.inputnum
  );
});
//This would need to verify token in future but for now it is fine
app.get("/status", (req, res) => {
  res.send(game.state);
});

app.get("/files", (req, res) => {
  const getFilesFlat = (dirPath) => {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    let files = [];
    items.forEach((item) => {
      const itemPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        files = files.concat(getFilesFlat(itemPath)); // Recursively add files
      } else {
        files.push(itemPath); // Add file path
      }
    });
    return files;
  };

  try {
    const files = getFilesFlat(user_dir_name); // Get all files as a flat list
    res.json(files); // Return the flat list of file paths
  } catch (error) {
    console.error("Error reading folder:", error);
    res.status(500).send("Error reading folder.");
  }
});

app.get("/testConnection", (req, res) => {
  console.log("Someone is trying to connect to this");
  res.send("You are connected");
  return "You are connected";
});

app.post("/frames/*", (req, res) => {
  let frame = req.params[0];
  frame += ".js";
  if (!frame) {
    return res.status(400).send("Frame name is needed");
  }
  let contentPath = path.resolve("static/core/frame/FrameTemplate.js");
  console.log("content Path : " + contentPath);
  let content = fs.readFileSync(contentPath);
  let filePath = path.join(user_code_dir, "frames", frame);
  try {
    fs.writeFileSync(filePath, content);
    res.send("Frame was created");
  } catch (error) {
    console.error("Error creating frame", error);
  }
});

app.post("/scenes/*", (req, res) => {
  let scene = req.params[0];
  scene += ".scene";
  if (!scene) {
    return res.status(400).send("Scene name is needed");
  }
  let contentPath = path.resolve("static/core/sceneTemplate.scene");
  console.log("content Path : " + contentPath);
  let content = fs.readFileSync(contentPath);
  let filePath = path.join(user_code_dir, "scenes", scene);
  try {
    fs.writeFileSync(filePath, content);
    res.send("Scene was created");
  } catch (error) {
    console.error("Error creating scene", error);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(user_code_dir, "resources"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
app.post("/resources", upload.single("file"), (req, res) => {
  let file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  res.status(200).send(`File ${file.originalname} uploaded successfully.`);
});

app.post("/files/*", (req, res) => {
  //console.log(req.headers);
  console.log(req.body);

  const filename = req.params[0];
  const { content } = req.body;

  if (!filename) {
    return res.status(400).send("Filename is required.");
  }
  const filePath = path.join(user_code_dir, filename);
  try {
    fs.writeFileSync(filePath, content || "");
    res.send(`File ${filename} created`);
  } catch (error) {
    console.error("Error creating file", error);
  }
});

//This delete is currently done by a query which could be still used in the future alongside a proj id and user account
app.delete("/files/*", (req, res) => {
  const filename = req.params[0];

  if (!filename) {
    return res.status(400).send("Filename is required.");
  }
  const filePath = path.join(code, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`${filename} deleted successfully`);
    } else {
      console.log(`${filename} not found`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
});

app.get("/files/*", (req, res) => {
  // console.log("Checking for file")
  const filename = req.params[0];
  // console.log(filename);
  if (!filename) {
    return res.status(400).send("Filename is required.");
  }
  let filePath = path.join(user_code_dir, filename);

  if (process.env.IS_DOCKER_CONTAINER == "true") {
    filePath = "/" + filePath;
  }
  console.log("filepath: " + filePath);
  try {
    if (!fs.existsSync(filePath)) {
      console.log("file path doesnt exist " + filePath);
      return res.status(404).send("File not found.");
    }
    console.log("trying to grab file from this path: " + filePath);
    //res.sendFile(path.resolve(filePath));
    res.sendFile(filePath);
    console.log("file found");
    //    const content = fs.readFileSync(filePath, "utf8");
    //   res.contentType(path.basename(filePath));
    //  res.send(content);
    //res.json({ filename, content });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).send("Error reading file.");
  }
});

app.post("/save", (req, res) => {
  const { filename, content } = req.body;
  if (!filename) {
    return res.status(400).send("Filename is required.");
  }
  const filePath = path.join(code, filename);
  try {
    fs.writeFileSync(filePath, content || "");
    res.send(`File ${filename} saved`);
  } catch (error) {
    console.error("Error saving file", error);
    res.status(500).send("Error saving file.");
  }
});

app.post("/folder", (req, res) => {
  console.log("Recieved folder message");
  const { foldername } = req.body;
  if (!foldername) {
    return res.status(400).send("Folder name is required.");
  }
  const folderPath = path.join(code, foldername);
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      const helloFilePath = path.join(folderPath, "hello.txt");
      fs.writeFileSync(helloFilePath, "hello world!");
      res.send(`Folder ${foldername} created`);
    } else {
      res.status(400).send("Folder already exists.");
    }
  } catch (error) {
    console.error("Error creating folder", error);
    res.status(500).send("Error creating folder.");
  }
});

app.delete("/folder", (req, res) => {
  const { foldername } = req.body;
  if (!foldername) {
    return res.status(400).send("Folder name is required.");
  }
  const folderPath = path.join(code, foldername);
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      res.send(`Folder ${foldername} and all its contents deleted`);
    } else {
      res.status(404).send("Folder not found.");
    }
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).send("Error deleting folder.");
  }
});

// Move file endpoint
app.put("/files/move", (req, res) => {
  const { oldPath, newPath } = req.body;

  if (!oldPath || !newPath) {
    return res.status(400).send("Both oldPath and newPath are required.");
  }

  const oldFilePath = path.join(code, oldPath);
  const newFilePath = path.join(code, newPath);

  try {
    // Check if source file exists
    if (!fs.existsSync(oldFilePath)) {
      return res.status(404).send("Source file not found.");
    }

    // Check if destination directory exists, create if it doesn't
    const newDir = path.dirname(newFilePath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Check if destination file already exists
    if (fs.existsSync(newFilePath)) {
      return res.status(409).send("Destination file already exists.");
    }

    // Move the file
    fs.renameSync(oldFilePath, newFilePath);

    console.log(`File moved from ${oldPath} to ${newPath}`);
    res.send(`File moved from ${oldPath} to ${newPath}`);
  } catch (error) {
    console.error("Error moving file:", error);
    res.status(500).send("Error moving file.");
  }
});

// Move folder endpoint
app.put("/folder/move", (req, res) => {
  const { oldPath, newPath } = req.body;

  if (!oldPath || !newPath) {
    return res.status(400).send("Both oldPath and newPath are required.");
  }

  const oldFolderPath = path.join(code, oldPath);
  const newFolderPath = path.join(code, newPath);

  try {
    // Check if source folder exists
    if (!fs.existsSync(oldFolderPath)) {
      return res.status(404).send("Source folder not found.");
    }

    // Check if it's actually a directory
    if (!fs.statSync(oldFolderPath).isDirectory()) {
      return res.status(400).send("Source path is not a directory.");
    }

    // Prevent moving a folder into itself or its subdirectories
    if (newPath.startsWith(oldPath + "/") || newPath === oldPath) {
      return res
        .status(400)
        .send("Cannot move folder into itself or its subdirectories.");
    }

    // Check if destination parent directory exists, create if it doesn't
    const newParentDir = path.dirname(newFolderPath);
    if (!fs.existsSync(newParentDir)) {
      fs.mkdirSync(newParentDir, { recursive: true });
    }

    // Check if destination folder already exists
    if (fs.existsSync(newFolderPath)) {
      return res.status(409).send("Destination folder already exists.");
    }

    // Move the folder
    fs.renameSync(oldFolderPath, newFolderPath);

    console.log(`Folder moved from ${oldPath} to ${newPath}`);
    res.send(`Folder moved from ${oldPath} to ${newPath}`);
  } catch (error) {
    console.error("Error moving folder:", error);
    res.status(500).send("Error moving folder.");
  }
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(process.cwd() + "/favicon.ico");
});


function scheduleSceneFileWrite() {
  if (sceneUpdateTimer) {
    clearTimeout(sceneUpdateTimer);
  }
  
  sceneUpdateTimer = setTimeout(async () => {
    if (pendingSceneUpdates.size === 0) return;
    
    try {
      const scenePath = path.join(user_code_dir, "scenes", game.active_scene);
      const sceneFileContent = fs.readFileSync(scenePath, "utf8");
      const sceneJson = JSON.parse(sceneFileContent);
      
      // Apply all pending updates
      for (const [objId, updateData] of pendingSceneUpdates.entries()) {
        const objIndex = sceneJson._objects.findIndex(obj => obj._id === objId);
        if (objIndex !== -1) {
          sceneJson._objects[objIndex]._pos = updateData._pos;
          sceneJson._objects[objIndex]._rot = updateData._rot;
          sceneJson._objects[objIndex]._sca = updateData._sca;
        }
      }
      
      fs.writeFileSync(scenePath, JSON.stringify(sceneJson, null, 2), "utf8");
      console.log(`✅ Scene file batch updated with ${pendingSceneUpdates.size} object(s)`);
      pendingSceneUpdates.clear();
    } catch (error) {
      console.error("Error writing scene file:", error);
    }
  }, 500); // Write to file 500ms after last update
}



io.on("connection", (socket) => {
  const sessionId = socket.request.session.id;
  socket.join(sessionId);

  console.log("session: " + sessionId);

  const clientType = socket.handshake.query.clientType;
  if (clientType === "react-editor") {
    console.log("Editor connected: " + sessionId);
    editors.push(sessionId);

    socket.on("disconnect", () => {
      console.log("Editor disconnect: " + sessionId);
      editors.splice(editors.indexOf(sessionId), 1);
    });
    socket.on("playButtonPress", () => {
      console.log("editor play button press");
      sendPlay();
    });
    socket.on("editButtonPress", () => {
      console.log("editor edit button press");
      sendEdit();
    });

    socket.join("editors");
    socket.on("edit:selected", (payload) => {
      console.log(
        "[server] edit:selected received:",
        payload,
        "from",
        sessionId
      );
      io.to("editors").emit("edit:selected", payload);
    });

    socket.on("update_sceneTest", async (msg) => {
  try{
    console.log("msg: " , msg);
    if (!game.scene || typeof game.scene === 'string') {
      game.scene = await loadSceneFromGame(game);
      
      if (game.scene && game.scene._setup) {
        await game.scene._setup();
        console.log("Scene setup completed");
      }
    }
    
    if (!game.scene || !game.scene._update_from_editor) {
      console.warn("Scene not loaded or invalid");
      return;
    }
    const success = game.scene._update_from_editor(msg);
    
    if (!success) {
      console.error("Failed to update object in scene");
      return;
    }
    
    console.log(`Object ${msg._id} queued for file update`);
    
    // Store update in memory and schedule batched file write
    pendingSceneUpdates.set(msg._id, msg);
    scheduleSceneFileWrite();
    // Immediately emit to all clients for real-time preview
    io.emit('object_property_update', msg);
    
    console.log("Emitted object_property_update to all clients");
  }
  catch (error){
    console.error("Error updating scene object:", error);
  }
});


//     socket.on("edit:selected", (payload) => {
//   console.log(
//     "[server] edit:selected received:",
//     payload,
//     "from",
//     sessionId
//   );
//   // Broadcast to other editors
//   io.to("editors").emit("edit:selected", payload);
  
//   // Also update the scene file
//   updateSceneFile(payload);
// });

async function updateSceneFile(msg) {
  try {
    if (!game.scene || typeof game.scene === 'string') {
      game.scene = await loadSceneFromGame(game);
      
      if (game.scene && game.scene._setup) {
        await game.scene._setup();
        console.log("Scene setup completed");
      }
    }
    
    if (!game.scene || !game.scene._update_from_editor) {
      console.warn("Scene not loaded or invalid");
      return;
    }
    
    // Convert edit:selected format to update format
    const updateData = {
      _id: msg.id,
      _pos: msg.pos,
      _rot: msg.rot,
      _sca: msg.sca,
      ess_cn: msg.name
    };
    
    const success = game.scene._update_from_editor(updateData);
    
    if (!success) {
      console.error("Failed to update object in scene");
      return;
    }

    console.log(`Object ${updateData._id} queued for file update`);
    
    // Store update in memory and schedule batched file write
    pendingSceneUpdates.set(updateData._id, updateData);
    scheduleSceneFileWrite();
    
    // Immediately emit to all clients for real-time preview (no lag)
    io.emit('object_property_update', updateData);
  } catch (error) {
    console.error("Error updating scene file from drag:", error);
  }
}

    return;
  }

  if (game.state === GameState.EDIT) {
    io.to(sessionId).emit("game_status", "edit");
  }
  // io.emit('chat message', "Player " + sessionId + " session established");
  console.log("Session " + sessionId + " established");

  game.players.push(sessionId);

  socket.on("disconnect", () => {
    game.players.splice(game.players.indexOf(sessionId), 1);
    console.log("Session " + sessionId + " disconnected");
    console.log("Active Sessions: " + game.players.length);
  });

  // probably gettting rid of this
  socket.on("inputs", (inputlist) => {
    game.client_updates.push({ type: "input", inputs: inputlist });
  });
  socket.on("client_update", (packet) => {
    game.client_updates.set(packet.playerid, packet.objects);
  });
  socket.on("select_seat", (seat) => {
    if (seat > 0 && seat <= game.scene.players_max) {
      game.players_seat.set(sessionId, seat);
    }
  });

  //make a socket funciton for sending the selected object for the properties menu

  // chat room test:
  // socket.on('chat message', (msg) => {
  //     io.emit('chat message', msg);
  //     io.to(sessionId).emit('chat message', "you just sent this ^ ");
  //     console.log(msg);
  // });
  // chat room test:
  // socket.on('chat message', (msg) => {
  //     io.emit('chat message', msg);
  //     io.to(sessionId).emit('chat message', "you just sent this ^ ");
  //     console.log(msg);
  // });
});

async function test_db(res) {
  let client = get_client();
  await client.connect();

  const result = await client.query("SELECT * FROM test_tab");
  let output_str = "Result: ";
  result.rows.forEach((row) => {
    output_str = output_str + row.uid + " ";
  });
  res.send(output_str);

  await client.end();
}

app.get("/test-db", (req, res) => {
  test_db(res);
});

app.get("/set-scene", (req, res) => {});

app.post("/set-scene/*", async (req, res) => {

  try{
  let scene = req.params[0];

  if(!scene.endsWith('.scene')){
    return res.status(400).json({ error: "Must be a .scene file" });

  }
  const sceneFileName = path.basename(scene);

  const fullPath = path.join(user_code_dir, "scenes", sceneFileName);
  if(!fs.existsSync(fullPath)){
    return res.status(404).json({error:"Scene file not found"})
  }

  //this does not change the scene yet needs to be worked on
  game.active_scene = sceneFileName;

  game.scene = await loadSceneFromGame(game);
    
    const sceneRoute = `./files/scenes/${game.active_scene}`;
    // for (const playerid of game.players) {
    //   io.to(playerid).emit('set_scene', sceneRoute);
    // }

    io.emit('set_scene', sceneRoute)
    
    console.log(`Active scene set to: ${game.active_scene}`);
    res.status(200).json({ 
      message: "Scene set successfully", 
      scene: game.active_scene,
      route: sceneRoute 
    }); 


  //console.log(scene);

}
catch(error){
  console.error("Error setting scene:", error);
  res.status(500).json({error: "Failed to set scene"});
}
})

function sendEdit() {
  // server_process.send("stop_game");
  game.stopGame();
  let count = 0;
  for (const playerid of game.players) {
    io.to(playerid).emit("game_status", "edit");
    count++;
  }
  return count;
}

function sendPlay() {
  let count = 0;
  // server_process.send("start_game");
  game.start();
  for (const playerid of game.players) {
    io.to(playerid).emit("game_status", "play");
    count++;
  }
  return count;
}

app.post("/test-edit", (req, res) => {
  const count = sendEdit();
  res.send(`Edit mode set for ${count} players`);
});
app.post("/test-play", (req, res) => {
  const count = sendPlay();
  res.send(`Edit mode set for ${count} players`);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/get-source-paths/", (req, res) => {
  get_source_paths(user_code_dir).then((paths) => {
    res.send({
      paths: paths,
    });
  });
});
