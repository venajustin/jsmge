// let frameModule;
// possibly conditional import depending on server/client 
// aka ` if (typeof window === "undefined") { `

// frameModule =  import("./core/frame.js");
// import("./core/frame.js").then((frameMod) => {


let events = []

function setup() {
    createCanvas(1600, 1200, P2D, document.getElementById('display-canvas'));

    obj1 = new Frame();
    obj1.position = {x:500,y:500,z:0};
    obj1.childrenObj.push(new Frame());
    obj1.childrenObj.push(new Frame());
    obj1.childrenObj[0].position = {x:30,y:30,z:0};
    obj1.childrenObj[1].position = {x:-30,y:30,z:0};
}

function keyPressed() {
    if (key === 'a') {
        console.log("a pressed");
        let newnum = 0;
        events.forEach((num) => {
            if (num >= newnum) {
                newnum = parseint(num) + 1;
            }
        });
        console.log("newnum: " + newnum);
        events.push(newnum.toString());
    }
}

function draw() {
    textSize(30);
    obj1._draw();

}




