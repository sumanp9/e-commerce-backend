const dbconfig = require("../config/dbconfig");
const dbConfig =  require("../config/dbconfig");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {

    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

     pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min, 
        acquire: dbConfig.pool.acquire,
        idle: dbconfig.pool.idle
     }
});

const db ={};

db.sequelize = Sequelize;
db.sequelize = sequelize;

db.ecommerce = require("./ecommerce_model")(sequelize, Sequelize);

module.exports =db;