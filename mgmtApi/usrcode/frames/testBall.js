import { Frame } from "#static/core/frame/frame.js"
import { AnimatedSprite } from "#static/core/frame/animated-sprite.js";
import { Collider } from "#static/core/frame/collider.js";
import { CollisionRect } from "#static/core/collision-shapes/collision-rect.js";


export class Ball extends Frame {

    velocity = {x:.7, y: 0, z:0};
    _pos = {x:500,y:500,z:0};


    constructor() {
        super();
        this.setupBallSprite();
        this.setupBallCollision();
    }

    setupBallSprite() {
        const ballSprite = new AnimatedSprite();
        ballSprite._add_image_source('./files/resources/joystick_circle_pad_d.png', 256, 256, 1);
        ballSprite._pos = {x:-10, y:-10, z:0};
        ballSprite.add_animation([0]);
        ballSprite._selected_animation = 0;
        ballSprite._sca = {x:.1, y:.1, z:1};
        
        this._animated_sprites.push(ballSprite);
    }

    setupBallCollision() {
        const ballCollider = new Collider();
        ballCollider._shape = new CollisionRect();
        ballCollider._shape.width = 25;
        ballCollider._shape.height = 25;
        
        this._colliders.push(ballCollider);
    }

    

    //jeremy is bum 
    handle_input(inputs) {

    }

    bouncetimer = 0; // TODO: make the collision give a normal so we don't need this workaround

    process_physics(deltaTime) {
        this._pos.x += this.velocity.x * deltaTime;
        this._pos.y += this.velocity.y * deltaTime;

        this.bouncetimer += deltaTime;

    }

    handle_collision(other) {
        console.log("Ball collision");
        if (other.constructor.name === "Walls") {
            this.bounce("y");
        } else {
            this.bounce("x");
        }


    }

    bounce(axis) {
        if (this.bouncetimer < 50) {
            console.log("bounce timer hit: " + this.bouncetimer);
            return;
        }
        this.bouncetimer = 0;
        if (axis === 'x') {
            this.velocity.x = -this.velocity.x;
              this.velocity.y = 1 * Math.random();
        } else {
            this.velocity.y = -this.velocity.y;
            this.velocity.x = this.velocity.x  ;
        }


    }


}
