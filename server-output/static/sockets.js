
import { editSketch } from "/core/edit-sketch.js";
import { playSketch } from "/core/play-sketch.js";
import { setSession, active_session} from "/core/session.js";

const socket = io();

socket.on('chat message', (msg) => {
    console.log("message recieved: " + msg);
});

socket.on('game_status', (msg) => {
    if (msg === 'edit') {
        console.log("game is in edit mode")
        setSession(editSketch);
        // document.getElementById('edit-message').style.display = 'block';
    } else {
        setSession(playSketch);
        // document.getElementById('edit-message').style.display = 'none';
    }
});

// Chat room test:
// const form = document.getElementById('form');
// const input = document.getElementById('input');
// let messages = [];
//
// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     if (input.value) {
//         socket.emit('chat message', input.value);
//         input.value = '';
//     }
// });
//
// socket.on('chat message', (msg) => {
//     const item = document.createElement('li');
//     item.textContent = msg;
//     messages.push(msg);
// });

