const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, check, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
let fetchuser = require('../middleware/fetchuser')



// const Token = require("../models/token");


// Create a user using POST '/api/routes'. Dosen't require login
router.post('/createuser', [
    body('email', 'Enter a valid Email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password must be of atleast 4 characters').isLength({ min: 4 }),
    body('cpassword', 'Password must be of atleast 4 characters').isLength({ min: 4 }),
],
    async (req, res) => {

        let success = false;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ validationErrors: errors.array() });
        }
        try {

            let user = await User.findOne({ email: req.body.email })

            if (user) {
                return res.status(400).json({ success, error: "A user with this email already exist" });
            }


            var salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hashSync(req.body.password, salt);

            user = await User.create({
                email: req.body.email,
                name: req.body.name,
                password: secPass,
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            var authtoken = jwt.sign(data, process.env.secret);
            success = true;
            res.send({ success, authtoken })
        } catch (error) {
            res.status(500).send("Internal server error has occured");
        }
    });


router.post('/login', [
    // Validate email
    body('email', 'Enter a valid Email').isEmail().normalizeEmail(),

    // Validate password
    body('password', 'Password cannot be blank').notEmpty().trim(),
], async (req, res) => {
    let success = false;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, validationErrors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please login using correct credentials" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success, error: "Please login using correct credentials" });
        }

        // Create a JWT token
        const payload = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(payload, process.env.secret, { expiresIn: '1h' }); // Token expires in 1 hour

        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error has occurred");
    }
});
//get user details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userID = req.user.id;
        // check whether user with this email  exist
        let user = await User.findOne({ userID }).select("-password");
        res.send(user)
    } catch (error) {
        res.status(500).send("Internal server error has occured")
    }
})

module.exports = router;