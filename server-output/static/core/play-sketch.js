
import { Scene } from  "/core/scene.js";
import { Frame } from "/core/frame/frame.js";
import { AnimatedSprite } from "/core/frame/animated-sprite.js";
import { process_edit_input } from "/core/input/edit_input.js";
import { Collider } from "/core/frame/collider.js";
import { CollisionSphere } from "/core/collision-shapes/collision-sphere.js";
import { edit_mouse_click, edit_mouse_press, edit_mouse_drag } from "/core/input/edit_input.js";
import { editSketch } from "/core/edit-sketch.js";
import { setSession } from "/core/session.js";


const playSketch = (p) => {

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

        p.scene._load(p);

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
        // Enter edit mode
        // TODO: make this triggered externally
        if (p.key === 'p') {
            p.remove();
            setSession(editSketch);
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
        if (!p.focused) {
            p.focused = true;
        }
    }



}

export { playSketch };
