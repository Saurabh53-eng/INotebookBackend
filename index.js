const express = require('express');
const connectToMongo = require('./database ');
var cors = require('cors');


connectToMongo();


const app = express();
app.use(cors());

app.use(express.json());// to accept json data

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

const PORT =  5000;

app.listen(PORT, console.log(`iNotebook backend listening on port ${PORT}`))