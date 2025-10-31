import {loadScene} from "./scene-operations.js";
import { json_exclude_members } from "#static/utility/json_exclusion.js";
import * as math from "mathjs";


export const GameState = Object.freeze({
    EDIT: 'edit',
    PLAY: 'play'
})


export class Game {
        state = GameState.EDIT;
        players = []; // maybe switch to set or map
        players_seat = new Map();
        socket;
        constructor(io) {
            this.socket = io;
        }

        // maps playerid to most recent update
        client_updates = new Map();

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

            // Loading scene every time
            //if (this.scene === undefined) {
                loadScene("./testUsr/scenes/testscene3.scene").then((scene) => {
                    this.scene = scene;
                    this.ready = true;
                });
            //}

            if (!this.running) {
                this.running = true;
                setImmediate(update_loop, this);
                // process.nextTick(update_loop);
            }

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
                const json = JSON.stringify(msg);
                this.socket.to(player).emit('update_scene', json);
            }
        }

}

function update_loop(game) {
    const currtime = Date.now();
    const dt = currtime - game.lastTime;
    game.lastTime = currtime;

    if (game.ready) {
        game.timer += dt;


//         let inputs = game.client_updates.pop();
//         if (inputs == undefined) {
//             inputs = [];
//         }

        game.scene._update_from_clients(game.client_updates);
        game.client_updates.clear();

        let input = []
        game.scene._update(dt, input);
        let collision_context = {
            mat: math.identity(3, 3)
        }
        game.scene._test_collisions(collision_context);


        const allobjects = game.scene._get_sync_members_synchronous();
        //console.log(allobjects);

        game.updatePlayers({objlist: allobjects});
        // console.log(game.scene);
    }

    if (game.running) {
        setImmediate(update_loop, game);
    }
}

