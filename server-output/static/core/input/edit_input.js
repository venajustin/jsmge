
function process_edit_input(editState) {

    // function to check on key states
    // there are also keys mapped out as callbacks

}

function edit_mouse_press(editState) {
    const point = {x:mouseX, y:mouseY};
    editState.selected = scene._intersect_point(point);
    editState.dragLast = point;
}

function edit_mouse_drag(editState) {
    const point = {x:mouseX, y:mouseY};
    const dx = point.x - editState.dragLast.x;
    const dy = point.y - editState.dragLast.y;
    editState.selected.forEach((o) => {
       o.position.x += dx;
       o.position.y += dy;
    });
    editState.dragLast = point;
}

function edit_mouse_click(editState) {
    editState.selected = undefined;
}


