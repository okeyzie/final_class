const userModel = require('../models/user');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, age, phoneNumber } = req.body;
        const existingEmail = await userModel.findOne({ email: email.toLowerCase() });
        const existingPhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber.trim() });

    
        if (existingEmail || existingPhoneNumber) {
            return res.status(400).json({ 
                message: 'User already exists' });
        };

        const saltRound = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, saltRound);

        const user = new userModel({
            fullName,
            email,
            password: hashedPassword,
            age,
            phoneNumber
        });

        // await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server error', 
            error: error.message });
    }   
};



exports.getOne = async (req, res) => {
    try {
        const id = req.params.id;

        const getUser = await userModel.findById(id);

        if (!getUser) {
            res.status(404).json(`User not found`)
        }

        res.status(200).json({
            message: `User found`,
            data: getUser
        })

    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server error', 
            error: error.message })
    }
}