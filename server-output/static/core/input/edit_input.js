
export function process_edit_input(p, editState) {

    // function to check on key states
    // there are also keys mapped out as callbacks

}

export function edit_mouse_press(p, editState) {
    editState.lockX = false;
    editState.lockY = false;
    const point = {x:p.mouseX, y:p.mouseY};
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
    const point = {x:p.mouseX, y:p.mouseY};
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


