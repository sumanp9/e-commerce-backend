const express =  require('express');
const cors = require('cors');
const bodyparser  = require('body-parser');

const app = express();



const corsOptions = {
    origin: "http://localhost:4200",
    credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json())


const db =  require("./app/models/index");

db.sequelize.sync()
    .then(() => {("Synced db");
    }) 
    .catch((err) => {
        console.log("failed to sync db: "+ err.message);
    })

require("./app/routes/routes.js") (app);
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running in port: ${PORT}`);
})
