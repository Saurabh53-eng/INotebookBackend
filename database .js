const mongoose = require('mongoose');
DB="mongodb+srv://bandsaurabh:iUrmgs2PMw9XloCw@cluster0.bjvzk.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = () => {
    try {
        mongoose.connect(DB, { dbName: 'INotebook', }).then(() => {
            console.log("Connected to mongodb Successfully");
        });
    } catch (error) {
        console.log(error);
        console.log("Could not connect database!");
    }
}

module.exports = connectToMongo;