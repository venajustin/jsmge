

import { editSketch } from "#static/core/edit-sketch.js";
import { setSession } from "#static/core/session.js";
import { loadScene } from "#static/utility/load-scene.js";
import { getClassList } from "#static/utility/class-list.js";

import * as math from "#static/libraries/math.js";

const playSketch = (p) => {

    p.updates = []

    p.setup = async () => {
        // p.createCanvas(1600, 1200, p.P2D, document.getElementById('display-canvas'));
        p.createCanvas(1600, 1200, p.P2D);


        p.setScene("/files/scenes/testscene2.scene");
        p.mode = 'play';


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
            console.log(p.scene._get_sync_members_synchronous());
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


        p.scene._update(p.deltaTime, inputs);
        let collision_context = {
            mat: math.identity(3, 3)
        }
        p.scene._test_collisions(collision_context);


        p.textSize(30);
        p.scene._draw(p);



        // message telling user to focus page
        // if (!p.focused) {
        //     p.fill(0,0,0,100);
        //     p.rect(0,0,1600,1200);
        //     p.fill(0,0,0,255);
        //     p.textAlign(p.CENTER, p.CENTER);
        //     p.text("Click To Focus", 500, 400);
        // }


    };

    p.mousePressed = () => {
        if (!p.focused) {
            p.focused = true;
        }
    }

    p.processServerUpdates = () => {
        p.scene._process_server_updates(p.updates);
        p.updates.length = 0;
    }

}

export { playSketch };
