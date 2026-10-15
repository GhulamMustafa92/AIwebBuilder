import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secureCookies = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: secureCookies ? "none" : "strict",
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, avatar });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successfully",
      user,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Google auth error",
    });
  }
};

export const logOut = async (req,res) => {
    try{
        res.clearCookie('token', cookieOptions);
        return res.status(200).json({message : "logout successfully"})
    }
    catch(err){
          console.log(err)
        return res.status(500).json({message : "logout error",err})
      
    }
}
