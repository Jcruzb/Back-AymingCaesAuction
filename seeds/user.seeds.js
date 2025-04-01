require("dotenv").config();
require("../config/db.config");

const mongoose = require("mongoose");
const Users = require("../models/User.model");
const users = require("./json/users.json");

const seedUsers = () => {
  return mongoose.connection
    .dropCollection("users")
    .then(() => {
      console.log("🧹 Colección 'users' eliminada");

      return Users.create(users);
    })
    .then((userDB) => {
      userDB.forEach((user) => {
        console.log(`✅ ${user.name} ha sido creado`);
      });

      console.log(`🎉 Se han creado ${userDB.length} usuarios`);
    })
    .catch((err) => {
      console.error("❌ Error en el seed de usuarios:", err);
    })
    .finally(() => {
      mongoose.disconnect();
    });
};

module.exports = seedUsers;

// Solo se ejecuta si el archivo se llama directamente desde CLI
if (require.main === module) {
  console.log("🚀 Ejecución directa del seed de usuarios...");
  mongoose.connection.once("open", () => {
    seedUsers();
  });
}