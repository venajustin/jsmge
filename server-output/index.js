import express from "express";
import path from "path";
import * as fs from 'node:fs';

import {getStatus, testfn} from '../usrcode/test.js';
import {setupCanvas} from './server/canvas.js';
import {exec} from "child_process"

const app = express();
const port = process.env.PORT || 3000;

const code = "testUsr" // temp will need to change this to /usrcode

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
  const folderPath = code; // temp will change this to code variable later
  console.log(`Accessing folder: ${folderPath}`);
  try {
    res.send(folderPath)
    const items = fs.readdirSync(folderPath);
    //res.json(`Found ${items.length} items in the root folder:`);
    items.forEach((item) => {
      const itemPath = path.join(folderPath, item);
      const isFile = fs.statSync(itemPath).isFile();
      console.log(`- ${item} (${isFile ? "File" : "Directory"})`);
    });
  } catch (error) {
    console.error("Error reading files:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile( process.cwd() + "/favicon.ico");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
