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
import { editSketch } from "/core/edit-sketch.js";
import { setSession } from "/core/session.js";

let events = []


/////////////////////////////////////////
//
//  NOTE: this code is not called and may be deleted in the future.
//        The scene is loaded when the 'game_status' message is sent
//        via socket.io
//
/////////////////////////////////////////

// const p5_session = new p5(sketch);
setSession(editSketch);


