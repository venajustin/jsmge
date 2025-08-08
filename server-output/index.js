import express from "express";
import path from "path";
import * as fs from 'node:fs';

// Change this to the directory loaded as usercode, set it to test-usercode for testing purposes
const user_code_dir = "./test-usrcode";

import { createServer } from "node:http";
import  { Server } from "socket.io";

import crypto from "crypto";
import session from "express-session";

import {createGame, GameState} from './server-core/game.js';

// import {} from '../usrcode/test.js';

const app = express();
const port = process.env.PORT || 3000;


const server = createServer(app);
const io = new Server(server);

const game = createGame();

app.use(express.static('static'));
app.use("/static", express.static("static"));
app.use("/user-static", express.static(user_code_dir + "/resources"));


const sessionMiddleware = session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

io.engine.use(sessionMiddleware);

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
    res.send(game.state);
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
    const sessionId = socket.request.session.id;
    socket.join(sessionId);

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
});


server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})