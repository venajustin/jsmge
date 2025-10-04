export let active_session = undefined;

export function setSession(sketch) {
    // const canvHTML =  `<canvas id="display-canvas" width="1600" height="1200" style="background-color:#ffffff"> </canvas>`
    // document.body.innerHTML = canvHTML + document.body.innerHTML;


    if (active_session) {
        console.log(Object.getOwnPropertyNames(active_session));
        active_session.remove();
    }




    active_session = new p5(sketch, document.body.innerHTML);
}
