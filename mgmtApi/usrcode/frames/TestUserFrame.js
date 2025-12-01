
import { Frame } from "#static/core/frame/frame.js";


export class TestUserFrame extends Frame {

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

}
