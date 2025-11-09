
import { PlayerFrame } from "#static/core/frame/PlayerFrame.js";
import {AnimatedSprite} from "#static/core/frame/animated-sprite.js";
import {Collider} from "#static/core/frame/collider.js";
import {CollisionRect} from "#static/core/collision-shapes/collision-rect.js";

export class Fighter extends PlayerFrame {

    setup() {
        this._pos = {x:100,y:500,z:0};
        this._owner = 1;

        const scribble_platformer_sprites = new AnimatedSprite();
        scribble_platformer_sprites._add_image_source('./files/resources/scribble_platformer.png', 64, 64, 121);
        scribble_platformer_sprites._pos = {x:-32, y:-32,z:0};
        // anim test
        // scribble_platformer_sprites.add_animation([20, 31]);
        scribble_platformer_sprites.add_animation([20]);
        scribble_platformer_sprites.add_animation([31]);
        scribble_platformer_sprites.add_animation([42]);
        scribble_platformer_sprites._sca = {x:1,y:1,z:1};
        scribble_platformer_sprites._rot = {x:0,y:0,z:0};
        this._animated_sprites.push(scribble_platformer_sprites);

        const p1Collider = new Collider();
        p1Collider._shape = new CollisionRect();
        p1Collider._shape.width = 32;
        p1Collider._shape.height = 64;
        this._colliders.push(p1Collider);

    }

    start() {
        this.swordchild = this.get_child("Sword");
    }

    handle_input(inputs) {
        // console.log("input handled");

        if (!inputs) {
            return;
        }
        if (inputs.includes("move_left")) {
            this._pos.x += -10;
            this._sca.x = -1;
        }

        if (inputs.includes("move_right")) {
            this._pos.x += 10;
            this._sca.x = 1;
        }
        if (inputs.includes("jump") && this.onground) {
            this.velocity.y = -.5;
        }
        if (inputs.includes("attack")) {
            this.swordchild.swing();
        }

        // if (inputs.contains("move_left") || inputs.contains("move_right")) {
        //     this.play_animation(0);
        // } else {
        //     obj1..animSprite.play_animation(1);
        // }
    }

    /// hacky implementation of touching, this should be a part of frame in the future
    floorheight = 9999999;
    handle_collision(other) {
        if (other.otype === "platform") {
            this.floorheight = other._pos.y;
        }
    }
    onground = false;
    velocity = {x:0,y:0};
    process_physics(deltaTime) {
        if (this._owner === 1) {
            this._animated_sprites[0].play_animation(0);
        } else if (this._owner === 2) {
            this._animated_sprites[0].play_animation(1);
        } else {
            this._animated_sprites[0].play_animation(2);
        }
        if (this._pos.y + 32 > this.floorheight) {
            this.onground = true;
            if (this.velocity.y > 0)  {
                this.velocity.y = 0;
            }
        } else {
            this.onground = false;
            this.velocity.y += .001 * deltaTime;
            if (this.velocity.y  > 30) {
                this.velocity.y = 30;
            }
        }
        this._pos.y += this.velocity.y * deltaTime;
    }

}
