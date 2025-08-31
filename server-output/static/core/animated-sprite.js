
class AnimatedSprite extends Frame {

    _draw() {
        push();
        translate(this.position.x,this.position.y,this.position.z);
        rotate(this.rotation.x,this.rotation.y,this.rotation.z);
        scale(this.scale.x,this.scale.y,this.scale.z);

        //draw image

        this.childrenObj.forEach((child) => {
            child._draw();
        });
        pop();
    }


}