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
            // check whether user with this email already exist
            let user = await User.findOne({ email: req.body.email })
            // if (req.body.cpassword != req.body.password) {
            //     return res.status(400).json({ success, error: "Password didn't match" });
            // }
            if (user) {
                return res.status(400).json({ success, error: "A user with this email already exist" });
            }
            // if (!user.verified) {
            //     let token = await Token.findOne({ userId: user._id })
            //     if (!token) {
            //         token = await new Token({
            //             userId: user._id,
            //             token: crypto.randomBytes(32).toString("hex")
            //         }).save();

            //         const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
            //         await sendEmail(user.email, "verify email", url)
            //     }
            //     return res.status(400).send({ message: 'An Email sent to your account please verify' })
            // }

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


//Login a user using credentials
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').notEmpty(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ validationErrors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // check whether user with this email  exist
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please login using correct credentials" })
        };
        let passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please login using correct credentials" })
        };
        const data = {
            user: {
                id: user.id
            }
        }
        var authtoken = jwt.sign(data, process.env.secret);
        success = true;
        res.json({ success, authtoken })
    } catch (error) {
        res.status(500).send("Internal server error has occured")
    }
})

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