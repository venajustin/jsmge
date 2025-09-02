// let frameModule;
// possibly conditional import depending on server/client 
// aka ` if (typeof window === "undefined") { `

// frameModule =  import("./core/frame.js");
// import("./core/frame.js").then((frameMod) => {


let events = []

function preload() {
    scene = new Scene();
    const obj1 = new Frame();
    obj1._pos = {x:560,y:520,z:0};

    horse = new Frame();
    horse._pos = {x:500,y:500,z:0};
    animSprite = new AnimatedSprite();
    animSprite._pos = {x:-100,y:-80,z:0};

    horse_img = loadImage('/static/horse.png');
    horse._children.push(animSprite);

    let coll = new Collider();
    // coll._shape = new CollisionRect({width: 200, height: 200});
    coll._shape = new CollisionSphere({radius: 50});
    horse._children.push(coll);

    scene._addObject(obj1);
    scene._addObject(horse);

    scene._load();

}

function setup() {
    createCanvas(1600, 1200, P2D, document.getElementById('display-canvas'));

    editState = {};

    mode = 'edit';
    animSprite._add_images(horse_img, 192, 144, 7);
    animSprite.add_animation([0, 1, 2, 3, 4, 5, 6]);
    animSprite.add_animation([0]);
    animSprite.play_animation(1);


}

function keyPressed() {
    if (key === 'r') {
        location.reload();
        // console.log("a pressed");
        // let newnum = 0;
        // events.forEach((num) => {
        //     if (num >= newnum) {
        //         newnum = parseint(num) + 1;
        //     }
        // });
        // console.log("newnum: " + newnum);
        // events.push(newnum.toString());
    }
}

function draw() {



    if (keyIsDown(65)) {
        console.log(animSprite._pos.x);
        horse._pos.x += -10;

    }

    if (keyIsDown(68)) {
        horse._pos.x += 10;
    }

    if (keyIsDown(65) || keyIsDown(68)) {
        animSprite.play_animation(0);
    } else {
        animSprite.play_animation(1);
    }


    scene._update(null);

    textSize(30);
    scene._draw();
    if (mode === 'edit') {
        scene._draw_editor();
    }
    if (mode === 'edit') {
        process_edit_input(editState);
    }

    // message telling user to focus page
    if (!focused) {
        fill(0,0,0,100);
        rect(0,0,1600,1200);
        fill(0,0,0,255);
        textAlign(CENTER, CENTER);
        text("Click To Focus", 500, 400);
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


