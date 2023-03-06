const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://bandsaurabh:itYaJzXe0aBy9HMb@cluster0.bjvzk.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongodb Successfully");
    })
}

module.exports = connectToMongo;