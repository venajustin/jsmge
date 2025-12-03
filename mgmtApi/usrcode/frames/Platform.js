import { StaticFrame } from "#static/core/frame/StaticFrame.js"
import {AnimatedSprite} from "#static/core/frame/animated-sprite.js";
import {Collider} from "#static/core/frame/collider.js";
import {CollisionRect} from "#static/core/collision-shapes/collision-rect.js";

export class Platform extends StaticFrame {
    setup() {
        this._pos = {x: 500, y: 750, z: 0};

        const floorsprite = new AnimatedSprite();
        floorsprite._add_image_source('/files/resources/button_square_wide.png', 256, 128, 1);
        floorsprite._pos = {x: -600, y: 0, z: 0};
        floorsprite.add_animation([0]);
        floorsprite._selected_animation = 0;
        floorsprite._sca = {x: 5, y: .1, z: 1};

        const floorcol = new Collider();
        floorcol._shape = new CollisionRect();
        floorcol._shape.width = 1024;
        floorcol._shape.height = 15;

        this._colliders.push(floorcol);
        this._animated_sprites.push(floorsprite);
    }
    otype = "platform";
}
