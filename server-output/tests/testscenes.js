
import fs from 'node:fs';

// imports from static core
import { Scene } from '../static/core/scene.js';
import { Frame } from '../static/core/frame/frame.js';
import { AnimatedSprite } from '../static/core/frame/animated-sprite.js';
import { Collider } from '../static/core/frame/collider.js';
import { CollisionSphere } from '../static/core/collision-shapes/collision-sphere.js';

import { getClassList } from '#static/utility/class-list.js';

// imports for getting class names
// in final product this should be its own service that parses through 
// all the files that we should get frame classes from
import * as SceneExports from '../static/core/scene.js';
import * as FrameExports from '../static/core/frame/frame.js';
import * as AnimatedSpriteExports from '../static/core/frame/animated-sprite.js';
import * as ColliderExports from '../static/core/frame/collider.js';
import * as CollisionSphereExports from '../static/core/collision-shapes/collision-sphere.js';

import  ESSerializer from 'esserializer';

export async function testScenes() {


    // creating scene draft
    const nscene = new SceneExports.Scene();

    
    const obj1 = new FrameExports.Frame();
    obj1._pos = {x:560,y:520,z:0};

    const horse = new FrameExports.Frame();
    horse._pos = {x:500,y:500,z:0};
    const animSprite = new AnimatedSpriteExports.AnimatedSprite();
    animSprite._pos = {x:-100,y:-80,z:0};

//    horse_img = loadImage('/static/horse.png');
    //horse._children.push(animSprite);

    let coll = new ColliderExports.Collider();
    // coll._shape = new CollisionRect({width: 200, height: 200});
    coll._shape = new CollisionSphereExports.CollisionSphere({radius: 50});
    horse._children.push(coll);

    nscene._addObject(obj1);
    nscene._addObject(horse);


    // getting all classes

    // we have to call eval within the scope of the declared objects
    const classes = await getClassList().then((val) => val.map(([classstr]) => eval(classstr)));
    //classes = [ Scene, Frame, AnimatedSprite, Collider, CollisionSphere ];

    console.log("@test >> Detected classes in imported files");
    console.log(classes);

    const serialScene = ESSerializer.serialize(nscene);

    console.log("@test >> Scene serialized as json");
    console.log(serialScene);

    const recreatedScene = ESSerializer.deserialize(serialScene, classes);
    console.log("@test >> Scene object recreated from json");
    console.log(recreatedScene);

    // saving scene to json file 
    fs.writeFileSync("testUsr/scenes/testscene1.scene", serialScene);

}

