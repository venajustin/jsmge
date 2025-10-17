// let frameModule;
// possibly conditional import depending on server/client 
// aka ` if (typeof window === "undefined") { `

// frameModule =  import("./core/frame.js");
// import("./core/frame.js").then((frameMod) => {


import { editSketch } from "./core/edit-sketch.js";
import { setSession } from "./core/session.js";

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


