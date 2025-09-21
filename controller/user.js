const userModel = require('../models/user');
const bcrypt = require('bcrypt')
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
//const { sendMail } = require('../middleware/email');
//const { sendMail } = require('../middleware/mailgun');
const { sendMail } = require('../middleware/turboSMTP');
const html = require('../middleware/signup');


exports.register = async (req, res) => {
  try {
    const { fullName, email, password, age, phoneNumber } = req.body;
    const file = req.file;
    let response;

    const existingEmail = await userModel.findOne({ email: email.toLowerCase() });
    const existingPhoneNumber = await userModel.findOne({ phoneNumber });

    if (existingEmail || existingPhoneNumber) {
      fs.unlinkSync(file.path)
      return res.status(400).json({
        message: `User already exists`
    })
    }

    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltRound);
    
    
    if (file && file.path) {
      response = await cloudinary.uploader.upload(req.file.path)
      fs.unlinkSync(file.path)
    }

    const user = new userModel({
      fullName,
      email,
      password: hashPassword,
      age,
      phoneNumber,
      profilePicture: {
        publicId: response.public_id,
        imageUrl: response.secure_url
      }
    });

    //await user.save()
    const subject = "Kindly verify your Email"
    const link = `${req.protocol}://${req.get("host")}/api/v1/verify/${user._id}`
    //const message = `Dear ${fullName}, thank you for registering with us. Please verify your email to complete the registration process.`
    await sendMail({
      to:email,
      subject,
      // text: message,
      html:html(link,user, fullName)
    })


    res.status(201).json({
      message: `Successfully registered user ${email}`,
      data: user
    })

  } catch (error) {
    console.log(error);
    
    fs.unlinkSync(file.path)
    res.status(500).json({
      message: `Internal Server Error`,
      error: error.message
    })
  }
}



exports.update = async (req, res) => {
  try {
    const {fullName, age} = req.body;
    const {id} = req.params;
    const file = req.file;
    let response;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json(`User not found`)
    }

    if (file && file.path) {
      await cloudinary.uploader.destroy(user.profilePicture.publicId)
      response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path)
    }

    const userData = {
      fullName: fullName ?? user.fullName,
      age: age ?? user.age,
      profilePicture: {
        imageUrl: response?.secure_url,
        publicId: response?.public_id
      }
    }

    const newData = Object.assign(user, userData)
    const update = await userModel.findByIdAndUpdate(user._id, newData, {new: true});

    res.status(200).json({
      message: `User updated successfully`,
      data: update
    })
    
  } catch (error) {
   res.status(500).json({
     message: `Inernal Server Error`,
    error: error.message})
}
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const file= req.file;
    
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        if (file && file.path) {
            await cloudinary.uploader.destroy(user.profilePicture.publicId)
            fs.unlinkSync(user.profilePicture.publicId)
        }
        res.status(200).json({
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'internal server error' + error.message,
            error: error.message
        });
    }
};

//get all users


exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'internal server error' + error.message,
            error: error.message
        });
    }
};

exports.verifyUser = async (req, res) => {
  try {
    const checkUser = await userModel.findById(req.params.id);
    if (!checkUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (checkUser.isVerified) {
      return res.status(400).json({
        message: 'Email is already verified'
      });
    }

    await userModel.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });

    res.status(200).json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'internal server error' + error.message,
      error: error.message
    });
  }
};
