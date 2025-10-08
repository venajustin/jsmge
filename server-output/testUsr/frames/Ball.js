import { Frame } from "#static/core/frame/frame.js"

export class Ball extends Frame {

    velocity = {x:0, y:0, z:0};

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
        this.bounce();
    }

    bounce() {
        if (this.bouncetimer < 50) {
            console.log("bounce timer hit: " + this.bouncetimer);
            return;
        }
        this.bouncetimer = 0;
        this.velocity.x = -this.velocity.x;
        this.velocity.y = -0.1;

    }


}
