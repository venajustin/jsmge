import express from "express";
const app = express();
const port = process.env.PORT || 3000;
import * as fs from 'node:fs';

import { testfn } from '../usrcode/test.js';
import { getStatus } from '../usrcode/test.js';

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

    testhtml = testhtml.replace("{{ msg }}", testfn());
    testhtml = testhtml.replace("{{ script }}", userjs);

    res.send(testhtml);
});

app.get("/test/:inputnum", (req, res) => {
    let msg = testfn();
    res.send("hello from container, " + msg + " <br> param: " + req.params.inputnum + " <br> query: " + req.query.inputnum );
});

app.get("/status", (req, res) => {
    res.send("running");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})