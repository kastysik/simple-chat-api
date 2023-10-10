const express = require('express');

const router = express.Router()

const User = require('../models/user');
const jwt = require("jsonwebtoken");

module.exports = router;

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, surname, nickname, password } = req.body;

        if (!(nickname && password)) {
            res.status(400).send("Password and nickname is required");
        }

        const existingUser = await User.findOne({ nickname });

        if (existingUser) {
            return res.status(409).send("User already exist");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            surname,
            nickname: nickname.toLowerCase(),
            password: encryptedPassword,
        });

        user.token = jwt.sign(
            { user_id: user._id, nickname },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        )
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

// Login
router.post("/login", (req, res) => {
// our login logic goes here
});

//Post Method
router.post('/postUser', async (req, res) => {
    const data = new User({
        name: req.body.name,
        surname: req.body.surname,
        nickname: req.body.nickname
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAllUsers', async (req, res) => {
    try {
        const data = await User.find();
        res.json(data)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOneUser/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        res.json(data)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/updateUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
