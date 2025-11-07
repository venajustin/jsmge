

import { editSketch } from "#static/core/edit-sketch.js";
import { setSession } from "#static/core/session.js";
import { loadScene } from "#static/utility/load-scene.js";
import { getClassList } from "#static/utility/class-list.js";

import * as math from "#static/libraries/math.js";
import {draw_seat_selection, test_seat_selection} from "#static/core/seat-selection.js";

const playSketch = (p) => {

    p.updates = []
    p.server = { connected: false, socket: undefined };

    p.playerid = undefined;

    p.setServer = (socket) => {
        p.server.socket = socket;
        p.server.connected = true;
    };
    p.setup = async () => {
        // p.createCanvas(1600, 1200, p.P2D, document.getElementById('display-canvas'));
        p.createCanvas(1600, 1200, p.P2D);


        p.setScene("/files/scenes/testscene3.scene");
        p.mode = 'play'
        // const response = await fetch("./files/scenes/testscene2.scene", {method:'GET'});
        // const scene_json = await response.text();
        // p.scene = await loadScene(scene_json);
        // await p.scene._load(p);


    };

    p.setScene = async (scene_route) => {
        console.log("changing scene to :" + scene_route);
        p.started = false;

        const response = await fetch(scene_route, {method:'GET'});
        const scene_json = await response.text();
        p.scene = await loadScene(scene_json);
        await p.scene._setup();
        await p.scene._load(p);

        p.started = true;
    }


    p.keyPressed = () => {
        // Enter edit mode
        // TODO: make this triggered externally
        if (p.key === 'p') {
           // p.remove();
            setSession(editSketch);
        }
        if (p.key === 'r') {
            // test reload scene from server
            // console.log(p.scene._get_sync_members_synchronous());
            console.log(p.scene._get_client_owned_members_synchronous(p.playerid));
        }
        if (p.key === '1') {
            console.log("playing as player 1")
            p.playerid = 1;
        }
        if (p.key === '2') {
            console.log("playing as player 2")
            p.playerid = 2;
        }
    };

    p.draw = () => {
        if (!p.started) {
            return;
        }

        p.processServerUpdates();

        let inputs = [];

        if (p.keyIsDown(65)) {
            inputs.push("move_left");
        }

        if (p.keyIsDown(68)) {
            inputs.push("move_right");
        }

        if (p.keyIsDown(87)) {
            inputs.push("move_up");
        }
        if (p.keyIsDown(83)) {
            inputs.push("move_down");
        }
        if (p.keyIsDown(32)) {
            inputs.push("jump");
        }
        if (p.keyIsDown(13)) {
            inputs.push("attack");
        }

        const input = [];
        input.push({playerid: p.playerid, inputs: inputs});
        p.scene._update(p.deltaTime, input);
        let collision_context = {
            mat: math.identity(3, 3)
        }
        p.scene._test_collisions(collision_context);


        p.textSize(30);
        p.scene._draw(p);

        if (p.server.connected) {

            const update_packet = {
                playerid: p.playerid,
                objects: p.scene._get_client_owned_members_synchronous(p.playerid)
            }
            p.server.socket.emit('client_update', update_packet);
        }


        // message telling user to focus page
        // if (!p.focused) {
        //     p.fill(0,0,0,100);
        //     p.rect(0,0,1600,1200);
        //     p.fill(0,0,0,255);
        //     p.textAlign(p.CENTER, p.CENTER);
        //     p.text("Click To Focus", 500, 400);
        // }

        if (p.playerid === undefined) {
            draw_seat_selection(p);
        }

    };

    p.mousePressed = () => {
        if (!p.focused) {
            p.focused = true;
        }
        if (p.playerid === undefined) {
            test_seat_selection(p, [p.mouseX, p.mouseY]);
        }
    }

    p.processServerUpdates = () => {
        p.scene._process_server_updates(p.updates, p.playerid);
        p.updates.length = 0;
    }

}

export { playSketch };
