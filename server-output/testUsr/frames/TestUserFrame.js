
import { Frame } from "#static/core/frame/Frame.js";

export class TestUserFrame extends Frame {

    testusermember = "hi from testuser";

    printmember() {
        console.log(this.testusermember);
    }

}
