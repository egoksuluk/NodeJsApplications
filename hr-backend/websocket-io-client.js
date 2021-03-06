const io = require("socket.io-client")
const io_client = io.connect("http://localhost:7001");
io_client.on("connect", () => {
    console.log("Connected to the websocket server!");
    io_client.on("fire", (emp) => {
        console.log(`${emp.fullname} is fired!`);
    });
    io_client.on("hire", (emp) => {
        console.log(`${emp.fullname} is hired!`);
    });
});
console.log("Websocket node client is running...");