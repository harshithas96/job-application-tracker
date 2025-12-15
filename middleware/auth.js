const User = require("../models/User")
const jwt = require("jsonwebtoken")

const userAuth = async(req,res,next)=>{
   try{
        const token = req.cookies.accessToken

        if(!token){
           return res.status(401).send("Please login")
        }

        const decodeObj = await jwt.verify(token, process.env.TOKEN)

        const {_id} = decodeObj

        const user = await User.findById(_id)

        if(!user){
            throw new Error("User not found")
        }

        req.user = user;
        next();

   }
   catch(err){
    res.status(400).json({message:err.message})
   }
}

module.exports = {
    userAuth
}