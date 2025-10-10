import {Game} from "./game.js";


const game = new Game();

console.log("Subprocess Created");

process.on("message", (msg) => {
    if (msg === "start_game") {
        console.log("start_game recieved");
        game.start();
    }
    if (msg === "stop_game") {
        console.log("stop_game recieved");
        game.stopGame();
    }
});