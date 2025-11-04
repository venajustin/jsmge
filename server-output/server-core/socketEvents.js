export default function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log("[server] client connected:", socket.id);

    const clientType = socket.handshake.query.clientType;
    if (clientType === "react-editor") {
      socket.join("editors");
      console.log(`[server] ${socket.id} joined "editors" room`);
    }

    socket.on("edit:selected", (payload) => {
      console.log("[server] edit:selected received:", payload);
      io.to("editors").emit("edit:selected", payload); // rebroadcast to editors
    });

    socket.on("disconnect", () => {
      console.log("[server] client disconnected:", socket.id);
    });
  });
}
