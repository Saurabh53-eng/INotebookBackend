const express = require('express');
const connectToMongo = require('./database');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // Allow cookies and credentials (if needed)
}));

require("dotenv").config();

connectToMongo();


app.use(express.json());// to accept json data


app.get("/", (req, res) => {
    res.json("Hello")
})
//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
//Use the client app
const PORT = process.env.PORT;

app.listen(PORT || 4000, console.log(`INotebook backend listening on port ${PORT}`));