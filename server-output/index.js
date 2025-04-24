import express from "express";
import cors from "cors"
import path from "path";
const app = express();
const port = process.env.PORT || 3000;
import * as fs from 'node:fs';

import { testfn } from '../usrcode/test.js';
import { getStatus } from '../usrcode/test.js';
import { setupCanvas } from './general/canvas.js';

//app.use(cors({ origin: "http://localhost:5173" }));
app.get("/", (req, res) => {
    let testhtml = "";
    try {
      const data = fs.readFileSync('./test.html', 'utf8');
      testhtml = data; // Text content of the file
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})