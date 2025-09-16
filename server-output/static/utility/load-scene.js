import { Scene } from '#static/core/scene.js';
import { Frame } from '#static/core/frame/frame.js';
import { AnimatedSprite } from '#static/core/frame/animated-sprite.js';
import { Collider } from '#static/core/frame/collider.js';
import { CollisionSphere } from '#static/core/collision-shapes/collision-sphere.js';
import { TestFrame } from "#static/core/frame/TestFrame.js";

import { getClassList } from '#static/utility/class-list.js'

export async function loadScene(sceneJson) {
    let classes = [];



        const class_strs = await getClassList();
        for ( let i = 0; i < class_strs.length; i++) {
            const class_str = class_strs[i][0];
            classes.push(eval(class_str));
        }
        //console.log(classes);
        return window.ESSerializer.deserialize(sceneJson, classes);




}
