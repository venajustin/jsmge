
import { Frame } from "#static/core/frame/frame.js";

export class TestFrame extends Frame {

    handle_input(inputs) {
        console.log("input handled");

        if (!inputs) {
            return;
        }
        if (inputs.includes("move_left")) {
            this._pos.x += -10;
        }

        if (inputs.includes("move_right")) {
            this._pos.x += 10;
        }
        //
        // if (inputs.contains("move_left") || inputs.contains("move_right")) {
        //     obj1.animSprite.play_animation(0);
        // } else {
        //     obj1..animSprite.play_animation(1);
        // }
    }

}