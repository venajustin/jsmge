import { Scene } from  "/core/scene.js";
import { Frame } from "/core/frame/frame.js";
import { AnimatedSprite } from "/core/frame/animated-sprite.js";
import { process_edit_input } from "/core/input/edit_input.js";
import { Collider } from "/core/frame/collider.js";
import { CollisionSphere } from "/core/collision-shapes/collision-sphere.js";
import { edit_mouse_click, edit_mouse_press, edit_mouse_drag } from "/core/input/edit_input.js";
import { setSession } from "/core/session.js";
import { playSketch } from "/core/play-sketch.js";
import {loadScene} from "#static/utility/load-scene.js";


const editSketch = (p) => {
    p.started = false

    p.setup = async () => {

        p.createCanvas(1600, 1200, p.P2D, document.getElementById('display-canvas'));

        const response = await fetch("/files/scenes/testscene1.scene", {method:'GET'});
        const scene_json = await response.json();
        p.scene = await loadScene(scene_json.content);
        await p.scene._load(p);

        p.editState = {};

        p.mode = 'edit';

        p.started = true;
    };

    p.keyPressed = () => {
        if (p.key === 'r') {
            location.reload();
        }
    

        // Enter play mode
        // TODO: make this triggered externally
        if (p.key === 'p') {
            p.remove();
            setSession(playSketch);
        }

    };

    p.draw = () => {
        if (!p.started) {
            return;
        }
        p.scene._update(null);

        p.textSize(30);
        
        // _draw method on all objs
        p.scene._draw(p);

        // debug stuff like draggable axis and colliders
        p.scene._draw_editor(p);

        // process dragging sliders
        process_edit_input(p, p.editState);

        // message telling user to focus page
        if (!p.focused) {
            p.fill(0,0,0,100);
            p.rect(0,0,1600,1200);
            p.fill(0,0,0,255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Click To Focus", 500, 400);
        }

    };

    //
    // Draggable axis
    // 

    p.mousePressed = () => {
        if (!p.focused) {
            p.focused = true;
        }
        if (p.mode === 'edit') {
            edit_mouse_press(p, p.editState);
        }
    };

    p.mouseDragged = () => {
        if (p.mode === 'edit') {
            edit_mouse_drag(p, p.editState);
        }
    };
    p.mouseReleased = () => {
        if (p.mode === 'edit') {
            edit_mouse_click(p, p.editState);
        }
    };
    
    //
    


}

export { editSketch };
