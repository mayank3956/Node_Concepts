const userModel = require("../models/userModel")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createToken = (_id) =>{
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtKey, {expiresIn:"3d"})
}

const registerUser = async (req, res) =>{
    try
   {
    console.log("req body", req.body);
    const {name, email, password } = req.body;
    let user = await userModel.findOne({email});
    if(user){
        return res.status(400).json("user is already exist with this email");
    }
    if(!name || !email || !password)
    {
        return res.status(400).json("All fields are mandotory");
    }
    if(!validator.isEmail(email))
    {
        return res.status(400).json("Email is invaild")
    }
    if(!validator.isStrongPassword(password))
    {
        return res.status(400).json("Password must be a strong password")
    }

    user= new userModel({name, email, password});
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save()
    const token = createToken(user._id)
    res.status(200).json({_id:user._id, name:user.name, email:user.email, token})
   }
   catch(error)
   {
    console.log(error)
    res.status(400).json(error)
   }
}

const loginUser =async (req, res) =>{
    const {email, password}= req.body;
    try{
        let user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json("user is not exist with this email");
        }
        const isValidpasssword = await bcrypt.compare(password, user.password);
        if(!isValidpasssword)
        {
            return res.status(400).json("Password is not correct");
        }
        const token = createToken(user._id);
        res.status(200).json({_id:user._id, name:user.name, email:user.email, token})
    }catch(error)
    {
        console.log(error);
    }
}

const findUser = async (req, res) =>{
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        res.status(200).json(user)
    }
    catch(error)
    {
        res.status(400).json(error)
    }
}

const getUsers = async (req, res) =>{
    try{
        const users = await userModel.find();
        res.status(200).json(users)
    }
    catch(error)
    {
        res.status(400).json(error)
    }
}

module.exports = {registerUser, loginUser, findUser, getUsers}