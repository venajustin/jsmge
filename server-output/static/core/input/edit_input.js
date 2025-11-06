import * as math from "mathjs";
export function process_edit_input(p, editState) {

    // function to check on key states
    // there are also keys mapped out as callbacks

}

export function edit_mouse_press(p, editState) {
    editState.lockX = false;
    editState.lockY = false;
    let point = {x:p.mouseX, y:p.mouseY};
    point = {x: point.x / p.editCamera.zoom, y: point.y / p.editCamera.zoom};
    point = {x: point.x + p.editCamera.pos[0], y: point.y  + p.editCamera.pos[1]};

    editState.currently_holding = false;
    editState.selected = p.scene._edit_drag_intersect(point, editState);
    if (editState.selected.length > 0) {
        editState.currently_holding = true;
    }
    editState.dragLast = point;


    //  At this point, send socket packet to server containing sel._id
    //  const last = editState.selected.length - 1;
    // const sel = editState.selected[last];
    


}

export function edit_mouse_drag(p, editState) {
    let point = {x:p.mouseX, y:p.mouseY};
    point = {x: point.x / p.editCamera.zoom, y: point.y / p.editCamera.zoom};
    point = {x: point.x + p.editCamera.pos[0], y: point.y  + p.editCamera.pos[1]};

    const dx = point.x - editState.dragLast.x;
    const dy = point.y - editState.dragLast.y;
    if (editState.currently_holding) {
        // TODO: clean up this functionality
        // I want it to only move one object, but i want that object to be the lowest in the chain of ownership
        // That way when objects overlap you can seperate them

        const last = editState.selected.length - 1;
        if (!editState.lockX) {
            editState.selected[last]._pos.x += dx;
        }
        if (!editState.lockY) {
            editState.selected[last]._pos.y += dy;
        }
    }
    // editState.selected.forEach((o) => {
    //    if (!editState.lockX) {
    //        o._pos.x += dx;
    //    }
    //    if (!editState.lockY) {
    //        o._pos.y += dy;
    //    }
    // });

    // if (editState.selected.size > 0) {
    //     const obj = editState.selected[0];
    //     obj.pos.x += dx;
    //     o._pos.y += dy;
    // }

    editState.dragLast = point;
}

export function edit_mouse_click(p, editState) {
    // editState.selected = undefined; //will remove this line to put like .isSelected = false
    editState.currently_holding = false;
}


export function edit_mouse_pan_press(p, camState) {
    camState.held = true;
    camState.last_point = [p.mouseX, p.mouseY];
}
export function edit_mouse_pan_drag(p, camState) {
    if (camState.held) {
        let dx = camState.last_point[0] - p.mouseX;
        let dy = camState.last_point[1] - p.mouseY;
        dx /= camState.zoom;
        dy /= camState.zoom;
        camState.pos[0] += dx;
        camState.pos[1] += dy;
        camState.last_point = [p.mouseX, p.mouseY];
    }
}
export function edit_mouse_pan_release(p, camState) {
    camState.held = false;
}
export function mouse_zoom(p, camState, delta) {
    let zoom_factor = 1.0;
    if (delta > 0) {
        zoom_factor = 0.93;
    } else {
        zoom_factor = 1.07;
    }
    const newzoom = camState.zoom * zoom_factor;
    // we need to solve the different screen sizes problem badly
    const dx = (p.mouseX / camState.zoom) - ( p.mouseX / newzoom);
    const dy = (p.mouseY / camState.zoom) - ( p.mouseY / newzoom);
    camState.pos[0] += dx;
    camState.pos[1] += dy;
//     const dx = (p.width / camState.zoom) - ( p.width / newzoom);
//     const dy = (p.height / camState.zoom) - ( p.height / newzoom);
//     camState.pos[0] += dx;
//     camState.pos[1] += dy;
    camState.zoom = newzoom;
}