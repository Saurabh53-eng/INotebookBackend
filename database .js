const mongoose = require('mongoose');

const connectToMongo = () => {
    try {
        mongoose.connect(process.env.DB, { dbName: 'INotebook', }).then(() => {
            console.log("Connected to mongodb Successfully");
        });
    } catch (error) {
        console.log(error);
        console.log("Could not connect database!");
    }
}

module.exports = connectToMongo;