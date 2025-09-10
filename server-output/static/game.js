// let frameModule;
// possibly conditional import depending on server/client 
// aka ` if (typeof window === "undefined") { `

// frameModule =  import("./core/frame.js");
// import("./core/frame.js").then((frameMod) => {

import { Scene } from  "/core/scene.js";
import { Frame } from "/core/frame/frame.js";
import { AnimatedSprite } from "/core/frame/animated-sprite.js";
import { process_edit_input } from "/core/input/edit_input.js";
import { Collider } from "/core/frame/collider.js";
import { CollisionSphere } from "/core/collision-shapes/collision-sphere.js";
import { edit_mouse_click, edit_mouse_press, edit_mouse_drag } from "/core/input/edit_input.js";

let events = []

const sketch = (p) => {

    p.preload = () => {
        p.scene = new Scene();
        const obj1 = new Frame();
        obj1._pos = {x:560,y:520,z:0};

        p.horse = new Frame();
        p.horse._pos = {x:500,y:500,z:0};
        p.animSprite = new AnimatedSprite();
        p.animSprite._pos = {x:-100,y:-80,z:0};

        p.horse_img = p.loadImage('/static/horse.png');
        p.horse._children.push(p.animSprite);

        let coll = new Collider();
        // coll._shape = new CollisionRect({width: 200, height: 200});
        coll._shape = new CollisionSphere({radius: 50});
        p.horse._children.push(coll);

        p.scene._addObject(obj1);
        p.scene._addObject(p.horse);

        p.scene._load();

    };

    p.setup = () => {
        p.createCanvas(1600, 1200, p.P2D, document.getElementById('display-canvas'));

        p.editState = {};

        p.mode = 'edit';
        p.animSprite._add_images(p.horse_img, 192, 144, 7);
        p.animSprite.add_animation([0, 1, 2, 3, 4, 5, 6]);
        p.animSprite.add_animation([0]);
        p.animSprite.play_animation(1);


    };

    p.keyPressed = () => {
        if (p.key === 'r') {
            location.reload();
            // console.log("a pressed");
            // let newnum = 0;
            // events.forEach((num) => {
            //     if (num >= newnum) {
            //         newnum = parseint(num) + 1;
            //     }
            // });
            // console.log("newnum: " + newnum);
            // events.push(newnum.toString());
        }
    };

    p.draw = () => {



        if (p.keyIsDown(65)) {
            console.log(p.animSprite._pos.x);
            p.horse._pos.x += -10;

        }

        if (p.keyIsDown(68)) {
            p.horse._pos.x += 10;
        }

        if (p.keyIsDown(65) || p.keyIsDown(68)) {
            p.animSprite.play_animation(0);
        } else {
            p.animSprite.play_animation(1);
        }


        p.scene._update(null);

        p.textSize(30);
        p.scene._draw(p);
        if (p.mode === 'edit') {
            p.scene._draw_editor(p);
        }
        if (p.mode === 'edit') {
            process_edit_input(p, p.editState);
        }

        // message telling user to focus page
        if (!p.focused) {
            p.fill(0,0,0,100);
            p.rect(0,0,1600,1200);
            p.fill(0,0,0,255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Click To Focus", 500, 400);
        }

    };

    p.mousePressed = () => {
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
};

const p5_session = new p5(sketch);
