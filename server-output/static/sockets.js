
const socket = io();

socket.on('chat message', (msg) => {
    console.log("message recieved: " + msg);
});

socket.on('game_status', (msg) => {
    if (msg === 'edit') {
        console.log("game is in edit mode")
        // document.getElementById('edit-message').style.display = 'block';
    } else {
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

