let active_session;

export function setSession(session) {
    const canvHTML =  `<canvas id="display-canvas" width="1600" height="1200" style="background-color:#ffffff"> </canvas>`
    document.body.innerHTML = canvHTML + document.body.innerHTML;

    active_session = new p5(session);
}
