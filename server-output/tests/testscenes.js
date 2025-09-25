
import fs from 'node:fs';


import { getClassList } from '#static/utility/class-list.js';

import { Scene } from "#static/core/scene.js";
import  ESSerializer from 'esserializer';

export async function testScenes() {

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
    
    const obj1 = new (findclass(cl, "Frame"))();
    const obj2 = new (findclass(cl, "TestUserFrame"))();
    obj2._pos = {x:400,y:400,z:0};
    console.log("TestuserFrame:");
    console.log(obj2);

    obj1._pos = {x:560,y:520,z:0};

    const horse = new (findclass(cl, "TestFrame"))();
    horse._pos = {x:500,y:500,z:0};
    const animSprite = new (findclass(cl, "AnimatedSprite"))();
    animSprite._pos = {x:-100,y:-80,z:0};

    animSprite._add_image_source('/static/horse.png',192, 144, 7 );
    animSprite.add_animation([0, 1, 2, 3, 4, 5, 6]);
    animSprite.add_animation([0]);





//    horse_img = loadImage('/static/horse.png');
    //horse._children.push(animSprite);

    let coll = new (findclass(cl, "Collider"))();
    // coll._shape = new cl.CollisionRect({width: 200, height: 200});
    coll._shape = new (findclass(cl, "CollisionSphere"))({radius: 50});
    horse._children.push(coll);
    horse._children.push(animSprite);

    nscene._addObject(obj1);
    nscene._addObject(obj2);
    nscene._addObject(horse);



    // getting all classes

    console.log("@test >> Detected classes in imported files");
    console.log(cl);

    const serialScene = ESSerializer.serialize(nscene);

    console.log("@test >> Scene serialized as json");
    console.log(serialScene);

    const recreatedScene = ESSerializer.deserialize(serialScene, cl);
    console.log("@test >> Scene object recreated from json");
    console.log(recreatedScene);

    // saving scene to json file 
    fs.writeFileSync("testUsr/scenes/testscene1.scene", serialScene);

    const serial_horse = ESSerializer.serialize(horse);
    fs.writeFileSync("testUsr/scenes/testobj.obj", serial_horse);
}

