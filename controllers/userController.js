const User = require("../models/User")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail")

const userSignUp = async(req,res)=>{
    try{

        const { name, email,  phoneNumber, password } = req.body


        if (await User.findOne({ email }))
            return res.status(400).json({ message: "Email already in use" });

        if (await User.findOne({ phoneNumber }))
            return res.status(400).json({ message: "Phone number already in use" });

        const user =  new User({
        name,
        email,
        phoneNumber,
        password
        })

        await user.save()
        res.status(201).json({message:`User created successfully with ${user.email}`})

    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

const userLogin = async(req,res) =>{
    try{
        const { email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({email});

        if(!user){
           return res.status(404).json({message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
           return res.status(400).json({message:"Invalid credentials"})
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        const accessToken = await jwt.sign(
            { _id: user._id }, 
            process.env.TOKEN, 
            {
            expiresIn: "15m",
        })

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )

        user.refreshToken = refreshToken;
        user.lastLoginAt = new Date();

        await user.save();

        res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",  
        secure: false, 
        maxAge: 15 * 60 * 1000,
        })

       res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "Login successful",
            user: user.email,
            userRole: user.role
        })
    }
    catch(err){
        res.status(500).send("ERROR : " + err.message)
    }
}


const refreshToken = async(req,res)=>{
    try{
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

   
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    const newAccessToken = jwt.sign(
      { _id: user._id },
      process.env.TOKEN,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, 
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({
      message: "Access token refreshed"
    });

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}

const userLogout = async(req,res)=>{
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await User.updateOne(
                { refreshToken },
                { $set: { refreshToken: null } }
            );
        }

    
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false 
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        })

    return res.status(200).json({ message: "Logout successful" });
    } 
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
    

const getAllUsers = async(req,res)=>{
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalCount = await User.countDocuments()

        const user = await User.find().select("-password").skip(skip).limit(limit)

        res.status(200).json({
            success: true,
            message: "Fetched all user details",
            count: totalCount,
            data: user
        })
    }
    catch(err){
        res.statusers.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
}


const getLoggedInDetails = async (req,res)=>{
    try{
        const { email } = req.user
        const user = await User.find({email:email})
        res.status(200).json({message:"Fetched your details", data:user})
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const updateDetails = async(req,res)=>{
    try{
        const userId = req.user._id;

        const allowedUpdates = [
            "name",
            "careerGoals",
            "linkedinUrl",
            "location",
            "experienceLevel"
        ]

        const updates = {};
        allowedUpdates.forEach((field) => {

        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
        })

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId,
             updates, 
             { new: true, runValidators: true }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const deleteUser = async(req,res)=>{
    try{
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" })
        }

        const userToDelete = await User.findById(userId)
            if (!userToDelete) {
                return res.status(404).json({ message: "User not found" })
            }

        if (userToDelete.isActive) {
            return res.status(400).json({ message: "Cannot delete an active user. Deactivate first." })
        }

        await User.findByIdAndDelete(userId)

    res.status(200).json({ message: "User deleted successfully" })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" })
    }

    const user = await User.findById(userId)

    const isMatch = await bcrypt.compare(oldPassword, user.password)

    if (!isMatch) 
        return res.status(400).json({ message: "Old password is incorrect" })

    user.password = newPassword

    await user.save()

    res.status(200).json({ message: "Password changed successfully" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 


    await user.save()

    console.log(resetToken)

    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    await sendEmail(user.email, "Password Reset", `Click to reset: ${resetUrl}`)

    res.status(200).json({ message: "Password reset link sent to email" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) return res.status(400).json({ message: "Invalid or expired token" })

    user.password = newPassword

    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.status(200).json({ message: "Password reset successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
    userSignUp,
    userLogin,
    refreshToken,
    userLogout,
    getAllUsers,
    getLoggedInDetails,
    updateDetails,
    deleteUser,
    changePassword, 
    forgotPassword, 
    resetPassword
}