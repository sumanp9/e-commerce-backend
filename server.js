const express =  require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: "http://localhost:4200"
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db =  require("./app/models/index");

db.sequelize.sync()
    .then(() => {("Synced db");
    }) 
    .catch((err) => {
        console.log("failed to sync db: "+ err.message);
    })

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to my ecommerce website"
    })
})

require("./app/routes/routes.js") (app);
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running in port: ${PORT}`);
})
