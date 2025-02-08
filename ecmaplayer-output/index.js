import express from "express";
const app = express();
const port = process.env.PORT || 3000;

import { testfn } from '../usrcode/test.js';

app.get("/", (req, res) => {
    let msg = testfn();
    res.send("hello from container, " + msg);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})