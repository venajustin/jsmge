
const points_cache = [];

export function draw_seat_selection(p) {


    p.fill(0,0,0,100);
    p.rect(0,0,1600,1200);
    p.fill(0,0,0,255);
    p.textAlign(p.CENTER, p.CENTER);
    let pos_counter = 100;
    p.push();
    p.translate(500, pos_counter,0);
    p.text("Select Player", 0, 0);
    p.pop();

    points_cache.length = 0;
    for (let i = 0; i < p.scene.players_max; i++ ){
        pos_counter += 50;
        p.push();
        p.translate(500, pos_counter, 0);
        p.fill(0,0,0);
        p.rect(-100,-25,200, 50);
        p.fill(255,255,255);
        p.text("Player " + (i + 1), 0,0);
        points_cache.push({playerid: (i+1), ypos: pos_counter});
        p.pop();
    }
}

export function test_seat_selection(p, point) {
    if (point[0] > 400 && point[0] < 600) {
        for (const button of points_cache) {
            if (point[1] > button.ypos - 25 && point[1] < button.ypos + 25) {
                console.log("setting player id to " + button.playerid);
                p.playerid = button.playerid;
            }
        }
    }
}