

import { Frame } from "#static/core/frame/frame.js";


export class Paddle extends Frame {

    velocity = {x:0, y:0, z:0};

    process_physics(deltaTime) {

        if (this.collider != undefined) {
        for (const obj of this.collider.touching) {
            obj.bounce();
        }}

        this._pos.x += this.velocity.x * deltaTime;
        this._pos.y += this.velocity.y * deltaTime;

    }

    handle_input(inputs) {
        // console.log("input handled");

        if (!inputs) {
            return;
        }
        
        if (inputs.includes("move_up")) {
            this.velocity.y = -1;
        } else if (inputs.includes("move_down")) {
            this.velocity.y = 1;
        } else {
            this.velocity.y = 0;
        }


        // if (inputs.contains("move_left") || inputs.contains("move_right")) {
        //     this.play_animation(0);
        // } else {
        //     obj1..animSprite.play_animation(1);
        // }
    }

}
