

import { editSketch } from "#static/core/edit-sketch.js";
import { setSession } from "#static/core/session.js";
import {loadScene} from "#static/utility/load-scene.js";


const playSketch = (p) => {

    p.setup = async () => {
        // p.createCanvas(1600, 1200, p.P2D, document.getElementById('display-canvas'));
        p.createCanvas(1600, 1200, p.P2D);


        const response = await fetch("/files/scenes/testscene2.scene", {method:'GET'});
        const scene_json = await response.text();
        p.scene = await loadScene(scene_json);
        await p.scene._load(p);


        p.editState = {};

        p.mode = 'play';


        p.started = true;


    };

    p.keyPressed = () => {
        // Enter edit mode
        // TODO: make this triggered externally
        if (p.key === 'p') {
           // p.remove();
            setSession(editSketch);
        }
    };

    p.draw = () => {
        if (!p.started) {
            return;
        }

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
        p.scene._test_collisions(p);


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



}

export { playSketch };
