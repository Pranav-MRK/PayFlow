const mongoose = require ('mongoose');

const accountSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        name:{
            type:String,
            trim: true,
            default: "Primary Wallet",
            required:true
        },
        type:{
            type:String,
            enum: ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"],
            required: true,
            default: "LIABILITY" // User balances are technically a liability for a payment platform
        },
        currency:{
            type:String,
            required: true,
            uppercase: true,
            maxLength: 3,
            default: "INR"
        },
        balance:{
            type:Number,
            required: true,
            default: 0 // Stored in minor units (e.g., paise for INR, cents for USD) to avoid floating-point errors
        },
        Status:{
            type:String,
            enum:["ACTIVE","FROZEN","SUSPENDED"],
            default:"ACTIVE",
        },
    },{
        timestamps:true,
    },
)

// prevent user from creating duplicate account with exact same name 

accountSchema.index({userId:1,name:1,currency:1},{unique:1});

module.exports = mongoose.model("Account",accountSchema);