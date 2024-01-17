const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const controller = require('./app/controller/controller.js');
const db = require('./app/models/index');
const routes = require('./app/routes/routes.js');
const eCommerceDB = db.ecommerce;

const secretKey = process.env.SECRET_KEY || 'fallback-secret-key';

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected");

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

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await eCommerceDB.User.findOne({
      where: { id: jwt_payload.sub },
      attributes: ['id', 'name'],
    });

    // Authenticate user based on role
    if (user && jwt_payload.role === "Admin") {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

routes(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running in port: ${PORT}`);
});
