

export function setupCanvas() {
        const c = document.getElementById("display-canvas");
        const ctx = c.getContext("2d");
        c.width = 1920;
        c.height = 1080;
        ctx.beginPath();
        ctx.rect(0,0,1920,1080);
        ctx.fill();
        ctx.stroke();

}


// module.exports = {setupCanvas};