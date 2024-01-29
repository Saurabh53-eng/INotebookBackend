const mongoose = require('mongoose');
const URI="mongodb+srv://bandsaurabh:iUrmgs2PMw9XloCw@cluster0.bjvzk.mongodb.net/?retryWrites=true&w=majority"
const connectToMongo =  () => 
mongoose.connect(URI,()=>{
    console.log("Connected to mongo Successfully");
})

module.exports = connectToMongo;