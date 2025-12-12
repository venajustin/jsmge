import { editSketch } from "./core/edit-sketch.js";
import { playSketch } from "./core/play-sketch.js";
import { setSession, active_session} from "./core/session.js";
import { get_app_socket_route } from "#static/utility/get_app_id.js";
// import { Manager } from "socket.io-client";

// Only initialize socket in browser environment
let socket = null;

if (typeof window !== 'undefined' && typeof io !== 'undefined') {
     socket = io(
        "/",
        { 
            path: get_app_socket_route() + "/socket.io",
            transports: ["websocket", "polling"],
            //CHANGED CLIENT TYPE TO GET THE UPDATE TO ACTUALLY SHOW FROM react-editor TO game-client
            query: { clientType: "game-client" } 
        }
    );
    socket.on("connect_error", err => console.error("connect_error:", err));
    socket.on("connect", () => console.log("connected", socket.id));

    //socket = io({ query: { clientType: "react-editor" } });

    socket.on('chat message', (msg) => {
        console.log("message recieved: " + msg);
    });

    socket.on('game_status', async (msg) => {
        if (msg === 'edit') {
            console.log("game is in edit mode")
            const response = await fetch(get_app_socket_route() + "/get-scene-route");
            const route = await response.text();
            await setSession(editSketch);
            console.log(`route for the editsketch when switching back to it: ${route}`);
            await active_session.setScene(route);
        } else if (msg === 'play') {
            console.log("play message received");
            const response = await fetch(get_app_socket_route() + "/get-scene-route");
            const route = await response.text();
            console.log(`this is the route before activating play sketch ${route}`);
            await setSession(undefined);
            await setSession(playSketch);
            await active_session.setServer(socket);
            await active_session.setScene(route);
            
        } 
    });

    socket.on('set_scene', (msg) => {
        console.log(`active session is being set as: ${msg}`);
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
