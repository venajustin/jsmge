import express from "express";
import path from "path";
import * as fs from 'node:fs';

// Change this to the directory loaded as usercode, set it to test-usercode for testing purposes
const user_code_dir = "./testUsr";

import { createServer } from "node:http";
import  { Server } from "socket.io";

import crypto from "crypto";
import session from "express-session";

import {getStatus, testfn} from '../usrcode/test.js';

import cors from "cors"

//import {setupCanvas} from './server/canvas.js';
import {get_client} from "./server/database/connect-db.js";
import {debug_set_env, get_source_paths} from "./server/util.js";


import {createGame, GameState} from './server-core/game.js';

// used for saving/loading scenes
import ESSerializer from "esserializer";




// import {} from '../usrcode/test.js';

const app = express();
const port = process.env.PORT || 3000;

const code = "testUsr" // temp will need to change this to /usrcode


debug_set_env();

const game = createGame();
const flask = "http://127.0.0.1/app/2/"


const editors = [];

app.use(express.static('static'));
app.use("/static", express.static("static"));
app.use("/user-static", express.static(user_code_dir + "/resources"));

app.use(express.json()) // This allows to parse json requests

const sessionMiddleware = session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

app.use(cors({ origin: "http://localhost:5173" }));

const server = createServer(app);
const io = new Server(server,
    {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

io.engine.use(sessionMiddleware);

//this is temporary fix for testing development


// watch files in the user's code directory to update editor
fs.watch(user_code_dir, {recursive: true}, () => {


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

        io.to(editor).emit('files_update', files);
    });

  } catch (error) {
    console.error("Error reading folder:", error);
  }


});


import {testScenes} from './tests/testscenes.js';
app.get('/tests/', (req,res) => {

    testScenes();

    res.send("Tests complete");


});

app.get("/old-root", (req, res) => {
    let testhtml = "";
    try {
      testhtml = fs.readFileSync('./test.html', 'utf8'); // Text content of the file
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
    res.send("hello from container, " + msg + " <br> param: " + req.params.inputnum + " <br> query: " + req.query.inputnum );
});

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
    const files = getFilesFlat(code); // Get all files as a flat list
    res.json(files); // Return the flat list of file paths
  } catch (error) {
    console.error("Error reading folder:", error);
    res.status(500).send("Error reading folder.");
  }
});

app.get("/testConnection", (req,res) => {
  console.log("Someone is trying to connect to this")
  res.send("You are connected")
  return "You are connected";
})


app.post("/files/*", (req, res) => {
  //console.log(req.headers);
  console.log(req.body);

  const filename = req.params[0];
  const { content } = req.body;

  if(!filename){
    return res.status(400).send("Filename is required.");
  }
  const filePath = path.join(code, filename);
  try {
    fs.writeFileSync(filePath, content || "");
    res.send(`File ${filename} created`);
  }
  catch (error){
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
  try{
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
      console.log(`${filename} deleted successfully`)
    }
    else{
      console.log(`${filename} not found`)
    }
  }
  catch(error){
    console.error("Error deleting file:", error);
  }
});

app.get("/files/*", (req, res) => {
  console.log("Checking for file")
  const filename = req.params[0];
  console.log(filename);
  if (!filename) {
    return res.status(400).send("Filename is required.");
  }
  const filePath = path.join(code, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found.");
    }
    const content = fs.readFileSync(filePath, "utf8");
    res.json({ filename, content });
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
  console.log("Recieved folder message")
  const {foldername } = req.body;
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
app.get('/favicon.ico', (req, res) => {
    res.sendFile( process.cwd() + "/favicon.ico");
});

io.on('connection', (socket) => {

    const sessionId = socket.request.session.id;
    socket.join(sessionId);

    console.log("session: " + sessionId);

    const clientType = socket.handshake.query.clientType;
    if (clientType === "react-editor") {
        console.log("Editor connected: " + sessionId);
        editors.push(sessionId);

        socket.on('disconnect',() => {
            editors.splice(editors.indexOf(sessionId),1);
        });
        return;
    }


    if (game.state === GameState.EDIT) {
        io.to(sessionId).emit('game_status', "edit");
    }
    // io.emit('chat message', "Player " + sessionId + " session established");
    console.log("Session " + sessionId + " established");

    game.players.push(sessionId);

    socket.on('disconnect',() => {
       game.players.splice(game.players.indexOf(sessionId),1);
       console.log("Session " + sessionId + " disconnected");
       console.log("Active Sessions: " + game.players.length);
    });
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

    const result = await client.query('SELECT * FROM test_tab');
    let output_str = "Result: ";
    result.rows.forEach(row => {
        output_str = output_str + row.uid + " ";
    })
    res.send(output_str);

    await client.end();
}

app.get('/test-db', (req, res) => {
   test_db(res);
});


server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})


app.get('/get-source-paths/', (req, res) => {

    get_source_paths(user_code_dir).then((paths) => {
        res.send({
            paths: paths
        });
    });
});
