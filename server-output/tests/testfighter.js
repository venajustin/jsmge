

import fs from 'node:fs';


import { getClassList } from '#static/utility/class-list.js';

import { Scene } from "#static/core/scene.js";
import { Paddle } from "#files/frames/Paddle.js";
import { Ball } from "#files/frames/Ball.js";
import { AnimatedSprite } from "#static/core/frame/animated-sprite.js";
import  ESSerializer from 'esserializer';
import { Collider } from "#static/core/frame/collider.js";
import { CollisionRect } from "#static/core/collision-shapes/collision-rect.js";
import { Walls } from "#files/frames/Walls.js";
import {Camera } from "#static/core/frame/Camera.js";
import {Fighter } from "#files/frames/Fighter.js";
import { Platform } from "#files/frames/Platform.js";
import { Sword } from "#files/frames/Sword.js";


export async function testfighter() {

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
    nscene.players_max = 4;

    const player1 =  new Paddle();
    player1._owner = 1;
    const player2 = new Paddle();
    player2._owner = 2;
    player1._pos = {x:100,y:500,z:0};



    player2._pos = {x:800,y:500,z:0};
    const ball = new Ball();
    // ball._pos = {x:500,y:500,z:0};

    // ball.velocity = {x:.1, y: 0, z:0};

    const wall_top = new Walls();
    wall_top._pos = {x:500,y:0,z:0};
    const wall_bottom = new Walls();
    wall_bottom._pos = {x:500,y:750,z:0};


    const wallsprite = new AnimatedSprite();
    wallsprite._add_image_source('/files/resources/button_square_wide.png', 256, 128, 1);
    wallsprite._pos = {x:-600, y:0,z:0};
    wallsprite.add_animation([0]);
    wallsprite._selected_animation = 0;
    wallsprite._sca = {x:5,y:.1,z:1};


    const wallcol = new Collider();
    wallcol._shape = new CollisionRect();
    wallcol._shape.width = 1024;
    wallcol._shape.height = 15;
    wall_top._colliders.push(wallcol);
    wall_top._animated_sprites.push(wallsprite);
    wall_bottom._colliders.push(wallcol);
    wall_bottom._animated_sprites.push(wallsprite);



    const paddleSprite = new AnimatedSprite();
    paddleSprite._add_image_source('./files/resources/button_square_wide.png', 256, 128, 1);
    paddleSprite._pos = {x:30, y:-130,z:0};
    paddleSprite.add_animation([0]);
    paddleSprite._selected_animation = 0;
    paddleSprite._sca = {x:1,y:.5,z:1};
    paddleSprite._rot = {x:3.1415 * .5,y:0,z:0};

    const ballSprite = new AnimatedSprite();
    ballSprite._add_image_source('./files/resources/joystick_circle_pad_d.png', 256, 256, 1);
    ballSprite._pos = {x:-10, y:-10,z:0};
    ballSprite.add_animation([0]);
    ballSprite._selected_animation = 0;
    ballSprite._sca = {x:.1,y:.1,z:1};

    ball._animated_sprites.push(ballSprite);

    player1._animated_sprites.push(paddleSprite);
    player2._animated_sprites.push(paddleSprite);

    const floor = new Platform();
//     const plat1 = new Platform();
//     const plat2 = new Platform();
    nscene._addObject(floor);
//     nscene._addObject(plat1);
//     nscene._addObject(plat2);
    floor.setup();
//     plat1.setup();
//     plat2.setup();
//     plat1._pos = {x: 400, y: 500, z: 0};
//     plat1._animated_sprites[0]._sca = {x: 2, y: .1, z: 1};
//     plat1._colliders[0].width = 409;
//     plat1._colliders[0].height = 6;
//     plat2._pos = {x: 800, y: 450, z: 0};
//     plat2._animated_sprites[0]._sca = {x: 2, y: .1, z: 1};
//     plat2._colliders[0].width = 409;
//     plat2._colliders[0].height = 6;


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

    const ballCol = new Collider();
    ballCol._shape = new CollisionRect();
    ballCol._shape.width = 25;
    ballCol._shape.height = 25;
    ball._colliders.push(ballCol);

    // nscene._addObject(player2);
    nscene._addObject(wall_bottom);

    const cam = new Camera();
    cam._pos = {x:500,y: 460,z:0};
    nscene._addObject(cam);

    const p1 = new Fighter();
    const p2 = new Fighter();

    nscene._addObject(p1);
    p1.setup();
    nscene._addObject(p2);
    p2.setup();
    p2._owner = 2;

    const sword1 = new Sword();
    p1._children.push(sword1);
    sword1.setup();
    const sword2 = new Sword();
    p1._children.push(sword2);
    sword2.setup();

    // assigning incremented id to every object
    let objlist = [];
    for (const obj of nscene._objects) {
        objlist.push(obj);
    }
    let nextlist = [];
    let newid = 0;
    while (objlist.length > 0) {
        for (const obj of objlist) {
            for (const child of obj._children) {
                nextlist.push(child);
            }
            for (const child of obj._animated_sprites) {
                nextlist.push(child);
            }
            for (const child of obj._colliders) {
                nextlist.push(child);
            }
            obj._id = newid;
            newid++;
        }
        objlist = nextlist;
        nextlist = [];
    }

    const serialScene = ESSerializer.serialize(nscene);

    console.log("@test >> Scene serialized as json");
    console.log(serialScene);

    const recreatedScene = ESSerializer.deserialize(serialScene, cl);
    console.log("@test >> Scene object recreated from json");
    console.log(recreatedScene);

    // saving scene to json file 
    fs.writeFileSync("testUsr/scenes/testscene3.scene", serialScene);

}

