import { editSketch } from "./core/edit-sketch.js";
import { playSketch } from "./core/play-sketch.js";
import { setSession, active_session} from "./core/session.js";
import { get_app_socket_route, get_app_socket_addr } from "#static/utility/get_app_id.js";
// import { Manager } from "socket.io-client";

// Only initialize socket in browser environment
let socket = null;

if (typeof window !== 'undefined' && typeof io !== 'undefined') {


//     const manager = new io.Manager(get_app_socket_addr(), {
//         // path: get_app_socket_route() + "/socket.io",
//         reconnectionDelayMax: 10000,
//         query: {
//             clientType: "react-editor"
//         },
//         transports: ["websocket", "polling"],
//     });
// 
//     const socket = manager.socket("/");
// 
//     manager.on("error", err => console.error("manager error:", err));
    socket = io(
        "http://localhost",
        { 
            path: get_app_socket_route() + "/socket.io",
            transports: ["websocket", "polling"],
            query: { clientType: "react-editor" } 
        }
    );
    socket.on("connect_error", err => console.error("connect_error:", err));
    socket.on("connect", () => console.log("connected", socket.id));

    console.log(" using path: " + get_app_socket_route());
    //console.log("starting socket on " + get_app_socket_addr());
    
    socket.on('chat message', (msg) => {
        console.log("message recieved: " + msg);
    });

    socket.on('game_status', (msg) => {
        if (msg === 'edit') {
            console.log("game is in edit mode")
            setSession(editSketch);
        } else if (msg === 'play') {
            setSession(undefined);
            setSession(playSketch);
            active_session.setServer(socket);
        } 
    });

    socket.on('set_scene', (msg) => {
        active_session.setScene(msg);
    });

    // socket.on('set_sceneEdit', (msg) => {
    //     active_session.setScene(msg);
    // });

    socket.on('update_scene', (msg) => {
        active_session.updates.push(JSON.parse(msg));
    });

    socket.on('update_sceneTest', (msg) => {
        console.log("Received property update:", msg);
    });

    socket.on('reload_scene', (sceneRoute) => {
        console.log("Reloading scene from:", sceneRoute);
        if (active_session && active_session.reloadScene) {
            active_session.reloadScene(sceneRoute);
        }
    });

    socket.on('object_property_update', (updateData) => {
        console.log("Received object property update:", updateData);
        if (active_session && active_session.updateObjectProperties) {
            active_session.updateObjectProperties(updateData);
        }
    });
}

export function emitSelectedToServer(data) {
    if (socket && socket.connected) {
        socket.emit("edit:selected", data);
        console.log("emit occurred");
    } else {
        console.warn("Socket not connected or not in browser environment");
    }
}
