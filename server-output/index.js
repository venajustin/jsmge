import express from "express";
import path from "path";
import * as fs from 'node:fs';

import { createServer } from "node:http";
import  { Server } from "socket.io";

import {getStatus, testfn} from '../usrcode/test.js';
const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server);


app.use(express.static('static'));

//app.use(cors({ origin: "http://localhost:5173" }));
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

app.get("/files", (req, res) => {
  const folderPath = "./applications/1";
  console.log(`Accessing folder: ${folderPath}`);
  const files = {};
  try {
    const fileNames = fs.readdirSync(folderPath);
    fileNames.forEach((fileName) => {
      const filePath = path.join(folderPath, fileName);
      console.log(`Found file: ${filePath}`);
      if (fs.statSync(filePath).isFile()) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        files[fileName] = fileContent;
      }
    });
    res.json(files);
  } catch (error) {
    console.error("Error reading files:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile( process.cwd() + "/favicon.ico");
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log(msg);
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
