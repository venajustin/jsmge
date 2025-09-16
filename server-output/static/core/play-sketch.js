
import { Scene } from  "/core/scene.js";
import { Frame } from "/core/frame/frame.js";
import { AnimatedSprite } from "/core/frame/animated-sprite.js";
import { process_edit_input } from "/core/input/edit_input.js";
import { Collider } from "/core/frame/collider.js";
import { CollisionSphere } from "/core/collision-shapes/collision-sphere.js";
import { TestFrame } from "/core/frame/TestFrame.js";
import { edit_mouse_click, edit_mouse_press, edit_mouse_drag } from "/core/input/edit_input.js";
import { editSketch } from "/core/edit-sketch.js";
import { setSession } from "/core/session.js";
import {loadScene} from "#static/utility/load-scene.js";


const playSketch = (p) => {

    p.setup = async () => {
        p.createCanvas(1600, 1200, p.P2D, document.getElementById('display-canvas'));


        const response = await fetch("/files/scenes/testscene1.scene", {method:'GET'});
        const scene_json = await response.json();
        p.scene = await loadScene(scene_json.content);
        await p.scene._load(p);


        p.editState = {};

        p.mode = 'play';


        p.started = true;


    };

    p.keyPressed = () => {
        // Enter edit mode
        // TODO: make this triggered externally
        if (p.key === 'p') {
            p.remove();
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



        p.scene._update(inputs);

        p.textSize(30);
        p.scene._draw(p);

        // message telling user to focus page
        if (!p.focused) {
            p.fill(0,0,0,100);
            p.rect(0,0,1600,1200);
            p.fill(0,0,0,255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Click To Focus", 500, 400);
        }


    };

    // p.mousePressed = () => {
    //     if (!p.focused) {
    //         p.focused = true;
    //     }
    // }



}

export { playSketch };
