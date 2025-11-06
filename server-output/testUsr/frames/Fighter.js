
import { Frame } from "#static/core/frame/frame.js";
import {AnimatedSprite} from "#static/core/frame/animated-sprite.js";
import {Collider} from "#static/core/frame/collider.js";
import {CollisionRect} from "#static/core/collision-shapes/collision-rect.js";

export class Fighter extends Frame {

    my_bool = false;
    my_true_bool = true;
    my_number = 24;
    my_obj = { 
        my_sub_num: 12,
        my_sub_obj: {
            my_sub_sub_word: "hi",
            my_sub_sub_bool: true
        }
    }
    my_words = "words words";

    setup() {
        this._pos = {x:100,y:500,z:0};
        this._owner = 1;

        const scribble_platformer_sprites = new AnimatedSprite();
        scribble_platformer_sprites._add_image_source('./files/resources/scribble_platformer.png', 64, 64, 121);
        scribble_platformer_sprites._pos = {x:-32, y:-32,z:0};
        scribble_platformer_sprites.add_animation([20]);
        scribble_platformer_sprites._selected_animation = 0;
        scribble_platformer_sprites._sca = {x:1,y:1,z:1};
        scribble_platformer_sprites._rot = {x:0,y:0,z:0};
        this._animated_sprites.push(scribble_platformer_sprites);

        const p1Collider = new Collider();
        p1Collider._shape = new CollisionRect();
        p1Collider._shape.width = 64;
        p1Collider._shape.height = 256;
        this._colliders.push(p1Collider);

    }

    start() {
        this._animated_sprites[0].play_animation(0);
    }

    handle_input(inputs) {
        // console.log("input handled");

        if (!inputs) {
            return;
        }
        if (inputs.includes("move_left")) {
            this._pos.x += -10;
        }

        if (inputs.includes("move_right")) {
            this._pos.x += 10;
        }

        // if (inputs.contains("move_left") || inputs.contains("move_right")) {
        //     this.play_animation(0);
        // } else {
        //     obj1..animSprite.play_animation(1);
        // }
    }

    process_physics(deltaTime) {
        //Write any physics your frame may have in the game
    }

}
