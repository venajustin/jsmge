// let frameModule;
// possibly conditional import depending on server/client 
// aka ` if (typeof window === "undefined") { `

// frameModule =  import("./core/frame.js");
// import("./core/frame.js").then((frameMod) => {


let events = []

function preload() {
    scene = new Scene();
    const obj1 = new Frame();
    obj1._pos = {x:500,y:500,z:0};
    obj1._children.push(new Frame());
    obj1._children.push(new Frame());
    obj1._children[0]._pos = {x:30,y:30,z:0};
    obj1._children[1]._pos = {x:-30,y:30,z:0};
    animSprite = new AnimatedSprite();
    animSprite._pos = {x:-30,y:30,z:0};

    horse_img = loadImage('/static/horse.png');
    obj1._children.push(animSprite);

    scene._addObject(obj1);

    scene._load();

}

function setup() {
    createCanvas(1600, 1200, P2D, document.getElementById('display-canvas'));

    editState = {};

    mode = 'edit';
    animSprite._add_images(horse_img, 192, 144, 7);


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
    scene._draw();
    if (mode === 'edit') {
        scene._draw_editor();
    }
    if (mode === 'edit') {
        process_edit_input(editState);
    }

}

function mousePressed() {
    if (mode === 'edit') {
        edit_mouse_press(editState);
    }
}

function mouseDragged() {
    if (mode === 'edit') {
        edit_mouse_drag(editState);
    }
}
function mouseReleased() {
    if (mode === 'edit') {
        edit_mouse_click(editState);
    }
}


