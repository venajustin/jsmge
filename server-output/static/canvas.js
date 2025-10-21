
let canvas;
let ctx;


function setupCanvas() {

        canvas = document.getElementById('display-canvas');
        ctx = canvas.getContext('2d');

        // Resize canvas to fit the screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
}

function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // chat example:
        // draw loop
        // let i = 0;
        // messages.forEach((message) => {
        //         ctx.fillText(message, 10, 50 + (i * 10));
        //         i++;
        // })



        requestAnimationFrame(update);
}




// module.exports = {setupCanvas};