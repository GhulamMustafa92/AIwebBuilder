import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.model.js';

dotenv.config()
const isAuth = async (req,res,next) => {
    try{
     const token = req.cookies.token;
     if(!token){
        return res.status(400).json({message : "token not found"})
     }
     const decode =  jwt.verify(token,process.env.JWT_SECRET)
     req.user = await User.findById(decode.id)
     next()
    }catch(err){
     return res.status(500).json({message : "Invalid token"})
    }
} 

export default isAuth;