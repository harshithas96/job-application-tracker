const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
           if(!validator.isEmail(value)){
            throw new Error("Invalid email address")
           }
           }
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isMobilePhone(value,"any")){
                throw new Error("Invalid phone number")
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim: true
        },
    role : {
        type: String,
        enum : ["user","admin"],
        default: "user"
    },
    careerGoals: {
        type: String,
        trim: true
    },
    refreshToken: {
        type: String
    },
    linkedinUrl: {
        type: String,
        trim: true,
        validate(value) {
            if (value && !validator.isURL(value)) {
            throw new Error("Invalid LinkedIn URL");
            }
        }
    },
    location: {
        type: String,
        trim: true
    },
    experienceLevel: {
        type: String,
        enum: ["fresher", "junior", "mid", "senior"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
      type: Date
    },
},
{
    timestamps: true
}
)


userSchema.pre("save", async function () {
  if (!this.isModified("password"))
    return ; 
  this.password = await bcrypt.hash(this.password, 10);

});

const User = new mongoose.model("User", userSchema)

module.exports = User