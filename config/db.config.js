const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite:../popupview-api/db/apidata.db');
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
//Models/tables
db.locations = require('../../popupview-api/models/location.js')(sequelize, Sequelize);
 
module.exports = db;