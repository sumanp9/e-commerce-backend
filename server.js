// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const controller = require('./app/controller/controller.js');
const db = require('./app/models/index');
const routes = require('./app/routes/routes.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Socket.IO setup
io.on("connection", (socket) => {
    console.log("A user connected");
    //socket.emit("test event", [1, 2, 3]);

    socket.on('updated event', (data) => {
        console.log("update: ", data);
    });
});

controller.setIoInstance(io);



// Database synchronization
db.sequelize.sync()
    .then(() => {
        console.log("Synced db");
    })
    .catch((err) => {
        console.log("failed to sync db: " + err.message);
    });

// Routes
routes(app);

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`);
});
