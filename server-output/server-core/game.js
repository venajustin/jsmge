import {loadScene} from "./scene-operations.js";

export const GameState = Object.freeze({
    EDIT: 'edit',
    PLAY: 'play'
})


export class Game {
        state = GameState.EDIT;
        active_scene = "testscene2.scene";
        players = []; // maybe switch to set or map

        client_updates = [];

        lastTime = Date.now();

        scene = undefined;

        running = false;
        ready = false;



        // running_instances = [];
        // only one instance should be running at a time
        // This system allows for game.start() to stop all other start() functions that are still running async
//         stopGame() {
//             console.log("Stopping: ");
//             console.log(this.running_instances);
//             this.state = GameState.EDIT;
//             for (let instance of this.running_instances) {
//                 instance.running = false;
//             }
//             this.running_instances.length = 0;
//         }
        stopGame() {
            console.log("stopping game");
            this.running = false;
        }
        start() {
            console.log("starting game");
            this.ready = false;
//             this.stopGame();
//             const instance = { running: true };
//             this.running_instances.push(instance);

            this.lastTime = Date.now();
            this.state = GameState.PLAY;

            loadScene("./testUsr/scenes/testscene2.scene").then((scene) => {
                this.scene = scene;
                this.ready = true;
            });

            if (!this.running) {
                this.running = true;
                process.nextTick(update_loop);
            }

        }
        timer = 0;
}

function update_loop() {
    const currtime = Date.now();
    const dt = currtime - game.lastTime;
    game.lastTime = currtime;

    if (game.ready) {
        game.timer += dt;
        if (game.timer > 3000) {
            console.log('tick');
            // console.log(game.scene);
            game.timer = 0;
        }
    }

    if (game.running) {
        setImmediate(update_loop);
    }
}

export const game = new Game();
