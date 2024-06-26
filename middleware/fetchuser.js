var jwt = require('jsonwebtoken');

const secret = "sp@cEs123";
const fetchuser = (req, res, next) => {
    // get the user from jwt token and append id to req object
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    } 
    try{ 
    const data = jwt.verify(token, secret);
    req.user = data.user;
    next();
    } catch (error) {
        res.status(401).send({ error: "Please use a valid token" })
    }
}

module.exports = fetchuser