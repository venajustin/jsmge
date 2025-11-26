import { Scene } from  "#static/core/scene.js";
import { Frame } from "#static/core/frame/frame.js";
import { AnimatedSprite } from "#static/core/frame/animated-sprite.js";
import { process_edit_input } from "#static/core/input/edit_input.js";
import { Collider } from "#static/core/frame/collider.js";
import { CollisionSphere } from "#static/core/collision-shapes/collision-sphere.js";
import { edit_mouse_click, edit_mouse_press, edit_mouse_drag , edit_mouse_pan_press, edit_mouse_pan_drag, edit_mouse_pan_release, mouse_zoom} from "#static/core/input/edit_input.js";
import { setSession } from "#static/core/session.js";
import { playSketch } from "#static/core/play-sketch.js";
import { loadScene } from "#static/utility/load-scene.js";


const editSketch = (p) => {
    p.started = false

    p.updates = [];
    p.setup = async () => {

        // p.createCanvas(1600, 1200, p.P2D, document.getElementById('display-canvas'));
        p.createCanvas(1600, 1200, p.P2D);

        const response = await fetch("./files/scenes/testscene3.scene", {method:'GET'});
        const scene_json = await response.text();
        p.scene = await loadScene(scene_json);
        await p.scene._load(p);

        p.editCamera = {
            pos: [0,0],
            zoom: 1.0
        }
        p.editState = {};

        p.mode = 'edit';

        p.started = true;
        
    };

    p.keyPressed = () => {
        if (p.key === 'r') {
            location.reload();
        }
        if (p.key === 'c') {
            p.scene._test_collisions(p);
        }
    

        // Enter play mode
        // TODO: make this triggered externally
        if (p.key === 'p') {
           // p.remove();
            setSession(playSketch);
        }

    };

    p.setScene = async (scene_route) => {
        console.log("changing scene to :" + scene_route);
        p.started = false;

        const response = await fetch(scene_route, {method:'GET'});
        const scene_json = await response.text();
        p.scene = await loadScene(scene_json);
        await p.scene._load(p);

        p.started = true;
    }

    p.draw = () => {

        if (!p.started) {
            return;
        }
        p.updates.length = 0;
        // p.scene._update(null);

        p.textSize(30);

        // translate by camera
        p.push();
        p.scale(p.editCamera.zoom, p.editCamera.zoom);
        p.translate(-p.editCamera.pos[0], -p.editCamera.pos[1]);

        // _draw method on all objs
        p.scene._draw(p);

        // debug stuff like draggable axis and colliders
        p.scene._draw_editor(p);

        // process dragging sliders
        process_edit_input(p, p.editState);

        p.pop();

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
        if (p.mode === 'edit' && p.mouseButton === p.LEFT ) {
            edit_mouse_press(p, p.editState);
        }
        if (p.mouseButton === p.RIGHT) {
            edit_mouse_pan_press(p, p.editCamera);
        }
    };

    p.mouseDragged = () => {
        if (p.mode === 'edit' && p.mouseButton === p.LEFT) {
            edit_mouse_drag(p, p.editState);
        }
        if (p.mouseButton === p.RIGHT) {
            edit_mouse_pan_drag(p, p.editCamera);
        }
    };
    p.mouseReleased = () => {
        if (p.mode === 'edit' && p.mouseButton === p.LEFT) {
            edit_mouse_click(p, p.editState);
        }
        if (p.mouseButton === p.RIGHT) {
            edit_mouse_pan_release(p, p.editCamera);
        }
    };




    p.reloadScene = async (sceneRoute) => {
        console.log("Reloading scene from:", sceneRoute);
        p.started = false;
        
        try {
            const response = await fetch(sceneRoute, {method:'GET'});
            const scene_json = await response.text();
            p.scene = await loadScene(scene_json);
            await p.scene._load(p);
            
            console.log("Scene reloaded successfully");
            p.started = true;
        } catch (error) {
            console.error("Error reloading scene:", error);
            p.started = true; // Resume even if reload fails
        }
    };

    // Helper function to find object by ID recursively
    p.findObjectById = (obj, id) => {
        if (obj._id === id) return obj;
        if (obj._objects && Array.isArray(obj._objects)) {
            for (let child of obj._objects) {
                const found = p.findObjectById(child, id);
                if (found) return found;
            }
        }
        return null;
    };
    p.updateObjectProperties = (updateData) => {
        if (!p.scene || !updateData || updateData._id === undefined) {
            console.warn("Invalid update data or scene not ready");
            return;
        }
        
        const obj = p.findObjectById(p.scene, updateData._id);
        if (!obj) {
            console.warn(`Object with ID ${updateData._id} not found`);
            return;
        }
        
        // Apply updates to the object
        if (updateData._pos) {
            obj._pos.x = updateData._pos.x;
            obj._pos.y = updateData._pos.y;
            obj._pos.z = updateData._pos.z;
        }
        if (updateData._rot) {
            obj._rot.x = updateData._rot.x;
            obj._rot.y = updateData._rot.y;
            obj._rot.z = updateData._rot.z;
        }
        if (updateData._sca) {
            obj._sca.x = updateData._sca.x;
            obj._sca.y = updateData._sca.y;
            obj._sca.z = updateData._sca.z;
        }
        if (updateData._speed !== undefined) {
            obj._speed = updateData._speed;
        }
        if (updateData.velocity) {
            obj.velocity = updateData.velocity;
        }
        console.log("✅ Object properties updated seamlessly:", obj);
    };
    p.mouseWheel = (event) => {
        mouse_zoom(p, p.editCamera ,event.delta);
    }
    

    


}

export { editSketch };
