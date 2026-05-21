const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            select: false,
            required:true,
        },
        role:{
            type:String,
            enum:["MERCHANT","ADMIN","AUDITOR"],
            default:'MERCHANT',
        },

    },
    {
        timestamps:true,
    }
)

module.exports = mongoose.model('User', userSchema);