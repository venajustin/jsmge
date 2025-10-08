
import fs from 'node:fs';


import { getClassList } from '#static/utility/class-list.js';

import { Scene } from "#static/core/scene.js";
import { Paddle } from "#files/frames/Paddle.js";
import { Ball } from "#files/frames/Ball.js";
import { AnimatedSprite } from "#static/core/frame/animated-sprite.js";
import  ESSerializer from 'esserializer';
import { Collider } from "#static/core/frame/collider.js";
import { CollisionRect } from "#static/core/collision-shapes/collision-rect.js";


export async function testpong() {

    const cl = await getClassList();
    console.log("classes:");
    console.log(cl);

    const findclass = (cl, name) => {
        return cl.find((c) => {
            return c.name === name;
        });
    }

    // creating scene draft
    const nscene = new Scene();

    const player1 =  new Paddle();
    const player2 = new Paddle();
    player1._pos = {x:100,y:500,z:0};


    player2._pos = {x:800,y:500,z:0};
    const ball = new Ball();
    ball._pos = {x:500,y:500,z:0};

    ball.velocity = {x:1, y: 0, z:0};


    const paddleSprite = new AnimatedSprite();
    paddleSprite._add_image_source('/files/resources/button_square_wide.png', 256, 128, 1);
    paddleSprite._pos = {x:30, y:-130,z:0};
    paddleSprite.add_animation([0]);
    paddleSprite._selected_animation = 0;
    paddleSprite._sca = {x:1,y:.5,z:1};
    paddleSprite._rot = {x:3.1415 * .5,y:0,z:0};

    const ballSprite = new AnimatedSprite();
    ballSprite._add_image_source('/files/resources/joystick_circle_pad_d.png', 256, 256, 1);
    ballSprite._pos = {x:-10, y:-10,z:0};
    ballSprite.add_animation([0]);
    ballSprite._selected_animation = 0;
    ballSprite._sca = {x:.1,y:.1,z:1};

    ball._animated_sprites.push(ballSprite);

    player1._animated_sprites.push(paddleSprite);
    player2._animated_sprites.push(paddleSprite);

    const p1Col = new Collider();
    p1Col._shape = new CollisionRect();
    p1Col._shape.width = 64;
    p1Col._shape.height = 256;
    player1._colliders.push(p1Col);

    const p2Col = new Collider();
    p2Col._shape = new CollisionRect();
    p2Col._shape.width = 64;
    p2Col._shape.height = 256;
    player2._colliders.push(p2Col);

    nscene._addObject(player1);
    nscene._addObject(player2);
    nscene._addObject(ball);
    

    const serialScene = ESSerializer.serialize(nscene);

    console.log("@test >> Scene serialized as json");
    console.log(serialScene);

    const recreatedScene = ESSerializer.deserialize(serialScene, cl);
    console.log("@test >> Scene object recreated from json");
    console.log(recreatedScene);

    // saving scene to json file 
    fs.writeFileSync("testUsr/scenes/testscene2.scene", serialScene);

}

