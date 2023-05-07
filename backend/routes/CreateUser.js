const express = require('express')
const router = express.Router()
const User = require('../models/User.js')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
router.post("/createuser",

    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),

    async (req, res) => {

        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        const secPassord = await bcrypt.hash(req.body.password, salt);

        try {
            await User.create({
                name: req.body.name,
                password: secPassord,
                email: req.body.email
            }).then(res.json({ success: true }));

        }
        catch (error) {
            res.json({ success: false });
        }


    })


router.post("/loginuser",

    async (req, res) => {


        let email = req.body.email;
        let age = req.body.age;
        try {
            let userData = await User.findOne({ email });
            const pwdPassword = await bcrypt.compare(req.body.password, userData.password);
            if (userData && pwdPassword) {
                const data = {
                      user:  {id : userData.id}
                    }
                   
                    return res.json({ success: true, childMode: age>=18 ? false : true });
                    }



            else {
                    return res.status(400).json({ errors: " try again with correct email and password" });
                }
            }
        catch (error) {
                console.log(error)
                res.json({ success: false });
            }
        })

        
module.exports = router;