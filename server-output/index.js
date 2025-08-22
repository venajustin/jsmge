import express from "express";
import path from "path";
import * as fs from 'node:fs';

import { createServer } from "node:http";
import  { Server } from "socket.io";

import crypto from "crypto";
import session from "express-session";

import {getStatus, testfn} from '../usrcode/test.js';

import cors from "cors"

//import {setupCanvas} from './server/canvas.js';
import {get_client} from "./server/database/connect-db.js";
import {debug_set_env} from "./server/util.js";


const app = express();
const port = process.env.PORT || 3000;

const code = "testUsr" // temp will need to change this to /usrcode


const server = createServer(app);
const io = new Server(server);
debug_set_env();


app.use(express.static('static'));
app.use(express.json()) // This allows to parse json requests

const sessionMiddleware = session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

io.engine.use(sessionMiddleware);

//this is temporary fix for testing development
app.use(cors({ origin: "http://localhost:5173" }));


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
    res.send("running");
});

// app.get("/files", (req, res) => {
//   const folderPath = code; // temp will change this to code variable later
//   console.log(`Accessing folder: ${folderPath}`);
//   try {
//     res.send(folderPath)
//     const items = fs.readdirSync(folderPath);
//     //res.json(`Found ${items.length} items in the root folder:`);
//     items.forEach((item) => {
//       const itemPath = path.join(folderPath, item);
//       const isFile = fs.statSync(itemPath).isFile();
//       console.log(`- ${item} (${isFile ? "File" : "Directory"})`);
//     });
//   } catch (error) {
//     console.error("Error reading files:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

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



app.post("/files", (req, res) => {
  //console.log(req.headers);
  console.log(req.body);
  const {filename, content } = req.body;
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
app.delete("/files", (req, res) => {
  const { filename } = req.query;
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

app.get("/file", (req, res) => {
  console.log("Checking for file")
  const { filename } = req.query;
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
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        io.to(sessionId).emit('chat message', "you just sent this ^ ");
        console.log(msg);
    });
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

async function register() {
  let client = get_client();
  await client.connect();

  const result = await client.query('');
  
}
