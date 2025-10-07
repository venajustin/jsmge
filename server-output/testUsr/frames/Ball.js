import { Frame } from "#static/core/frame/frame.js"

export class Ball extends Frame {

    velocity = {x:0, y:0, z:0};

    handle_input(inputs) {
        if (!inputs) {
            return;
        }
        if (inputs.includes("move_right")) {
            this.bounce();
        }
    }

    process_physics(deltaTime) {
        this._pos.x += this.velocity.x * deltaTime;
        this._pos.y += this.velocity.y * deltaTime;


    }

    bounce() {
        this.velocity.x = -this.velocity.x;

    }


}
