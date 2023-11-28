const User = require('../models/userModel')
const generateAccessToken = require('../config/generateToken')
const asyncHandler = require("express-async-handler");

const login = asyncHandler(async (req, res) => {

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!req.body.email || !req.body.password) {
        res.status(400);
        throw new Error('Enter both email and password');
    } else if (!emailRegex.test(req.body.email)) {
        res.status(400);
        throw new Error('Enter a valid email address');
    } else {
        const registeredUser = await User.findOne({ email: req.body.email })

        if (registeredUser && (await registeredUser.verifyPassword(req.body.password))) {
            const data = {
                name: registeredUser.name,
                email: registeredUser.email,
                userId: registeredUser._id,
                profilePic: registeredUser?.profilePic,
                token: generateAccessToken(registeredUser._id)
            }
            res.json({
                success: true,
                data: data
            })
        } else {
            throw new Error("Email id or password does not exist")
        }
    }


})


const register = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400);
        throw new Error('Please send all the details');
    }


    const emailRegex = /^\S+@\S+\.\S+/;

    if (!emailRegex.test(req.body.email)) {
        res.status(400);
        throw new Error('Invalid email address');
    }


    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;

    if (!passwordRegex.test(req.body.password)) {
        res.status(400);
        throw new Error('Password must have at least 8 characters with 1 special character and 1 number');
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    } else {
        const userCreated = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            profilePic: req.body?.profilePic
        });

        if (userCreated) {
            const data = {
                name: userCreated.name,
                email: userCreated.email,
                userId: userCreated._id,
                profilePic: userCreated?.profilePic,
                token: generateAccessToken(userCreated._id)
            };
            res.status(201).json({
                data: data,
                success: true
            });
        } else {
            res.status(400);
            throw Error('Failed to register the user');
        }
    }
});

const getBlabberUsers = asyncHandler(async (req, res) => {
    const { userid } = req.headers;

    if (!userid) {
        res.status(400);
        throw new Error("Please send userid");
    } else {
        const filter = req.query?.filter || '';

        const users = await User.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: filter, $options: 'i' } },
                        { email: { $regex: filter, $options: 'i' } },
                    ],
                },
                { _id: { $ne: userid } },
            ],
        }).select('-password');

        res.json({
            success:true,
            message:'User retrieved successfully',
            data: users,
        });
    }
});


module.exports = { login, register, getBlabberUsers }