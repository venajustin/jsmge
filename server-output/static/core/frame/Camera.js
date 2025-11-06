import {Frame} from "#static/core/frame/frame.js"

export class Camera extends Frame {

    // moves the
    _draw(p) {
        // does nothing, seperate cam_draw() method handles transforming the view of the owning player
    }



    _camera_transform(p) {
        p.translate(-this._pos.x - 1600/2,-this._pos.y - 1200/2,-this._pos.z);
        p.rotate(-this._rot.x,-this._rot.y,-this._rot.z);
        p.scale(-this._sca.x,-this._sca.y,-this._sca.z);
    }

    _draw_editor(p) {

        p.push();
        p.translate(this._pos.x,this._pos.y,this._pos.z);


        p.stroke(255,0,0,255);
        p.noFill();
        p.rect(-1600/3, -1200/3, 1600/1.5, 1200/1.5);


        p.fill(255,0,0,255);
        p.noStroke();
        p.rect(0,0,2,-30);
        p.fill(255,0,0,255);
        p.noStroke();
        p.triangle(1,-35,-3,-30,5,-30);

        p.fill(0,0,255,255);
        p.noStroke();
        p.rect(0,0,30,2);
        p.fill(0,0,255,255);
        p.noStroke();
        p.triangle(35,1,30,-3,30,5);

        p.fill(0,0,0,25);
        p.stroke(0,0,0,100);
        p.rect(1,1,10,-10);



        p.fill(0,0,0,255);
        p.rect(-1,-1,4,4);
        p.pop();
    }

}