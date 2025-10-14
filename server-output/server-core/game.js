import {loadScene} from "./scene-operations.js";

export const GameState = Object.freeze({
    EDIT: 'edit',
    PLAY: 'play'
})


export class Game {
        state = GameState.EDIT;
        active_scene = "testscene2.scene";
        players = []; // maybe switch to set or map
        socket;
        constructor(io) {
            this.socket = io;
        }

        client_updates = [];
        server_updates = []; // possibly not needed

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

            if (this.scene === undefined) {
                loadScene("./testUsr/scenes/testscene2.scene").then((scene) => {
                    this.scene = scene;
                    this.ready = true;
                });
            }

            if (!this.running) {
                this.running = true;
                setImmediate(update_loop, this);
                // process.nextTick(update_loop);
            }
            this.ready = true;

        }
        setScene(scenepath) {
            this.ready = false;
            loadScene(scenepath).then((scene) => {
                this.scene = scene;
                this.ready = true;
            });
        }

        updatePlayers(msg) {
            for (const player of this.players) {
                this.socket.to(player).emit('update_scene', JSON.stringify(msg));
            }
        }

        timer = 0;
}

function update_loop(game) {
    const currtime = Date.now();
    const dt = currtime - game.lastTime;
    game.lastTime = currtime;

    if (game.ready) {
        game.timer += dt;
        if (game.timer > 3000) {
            console.log('tick');
            
            let allobjects = [];
            let olist = [];
            for (const obj of game.scene._objects) {
                olist.push(obj);
            }
            let nextlist = [];
            while (olist.length > 0) {
                for (const obj of olist) {
                    for (const child of obj._children) {
                        nextlist.push(child);
                    }
                    for (const child of obj._animated_sprites) {
                        nextlist.push(child);
                    }
                    for (const child of obj._colliders) {
                        nextlist.push(child);
                    }
                    allobjects.push(obj);
                }
                olist = nextlist;
                nextlist = [];
            }

            // console.log(allobjects);
            
            game.updatePlayers({objlist: [{_id: 0, _pos: {x:1, y:1, z:1}}]});
            // console.log(game.scene);
            game.timer = 0;
        }
    }

    if (game.running) {
        setImmediate(update_loop, game);
    }
}

