require("dotenv").config();
require("../config/db.config");

console.log("Seeding standar projects...")

const mongoose = require("mongoose");
const Category = require("../models/StandarProject.model");
const categorys = require("./json/standarProjects.json");


  console.log("corriendo semilla ")
  mongoose.connection.once("open", () => {
  mongoose.connection
    .dropCollection("StandardProjects")
    .then(() => {
      console.log("DB cleared");
    
      return Category.create(categorys);
    })
    .then((standarProjectDB) => {
        standarProjectDB.forEach((file) => {
        console.log(`${file.code} has been created`);
      });

      console.log(`${standarProjectDB.length} files have been created`);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      mongoose.disconnect();
    });
});