
export function setupCanvas() {
    const canvas = document.getElementById("display-canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    var grd = ctx.createLinearGradient(0, 0, 1080, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1920, 1080);
}

