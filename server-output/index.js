import express from "express";
import path from "path";
import * as fs from 'node:fs';

import {getStatus, testfn} from '../usrcode/test.js';
import {setupCanvas} from './server/canvas.js';
import {get_client} from "./server/database/connect-db.js";

const app = express();
const port = process.env.PORT || 3000;

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
