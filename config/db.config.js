const mongoose = require('mongoose');

const DB_Name = 'AymingCaesAuction_DB';
const URI = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${DB_Name}` || `mongodb://localhost:27017/${DB_Name}`;
const DB_URL = `${URI}`;

mongoose.connect(DB_URL)
    .then(() => {
        console.info(`Successfully connected to the database ${DB_Name}`);
    })
    .catch((error) => {
        console.log(`An error occurred while trying to connect to the database ${DB_Name}`);
        console.log(error);
    });

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log(`Connection to the database ${DB_Name} is closed`);
        process.exit(0);
    });
});

