
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema= new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            minlength:5,
            maxlength: 8,
        },
        password:{
            type: String,
            required: true,
            minlength: 8
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        
        },
        fullName:{
            type: String,
            required: true,

        },
        avatar:{
            type:String
        },
        refreshToken:{
            type: String
        }

},
{timestamps: true})

userSchema.pre("save",async function() {
    if (!this.isModified("password")) {
        return
    }
    this.password =await bcrypt.hash(this.password,10)
})
userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

// generate access token
userSchema.methods.generateAccessToken= function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRETE,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

//generate refresh token
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRETE,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User= mongoose.model("User", userSchema)

