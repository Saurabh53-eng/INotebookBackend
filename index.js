const express = require('express');
const connectToMongo = require('./database');
var cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();

connectToMongo();


const app = express();

app.use(express.json());// to accept json data
app.use(cookieParser);
app.use(cors(
    {
        origin: ["https://i-notebook-frontend-zeta.vercel.app/login"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));


app.get("/", (req, res) => {
    res.json("Hello")
})
//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
//Use the client app
const PORT = process.env.PORT;

app.listen(PORT || 4000, console.log(`INotebook backend listening on port ${PORT}`));