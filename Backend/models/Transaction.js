const mongoose = require('mongoose');


const transactionLineSchema = new mongoose.Schema(
    {
        accountId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Account",
            required:true,
        },
        amount:{
            type:Number,
            required:true,
        },
        description:{
            type:String,
            trim:true
        },
    }
);

const transactionSchema = new mongoose.Schema(
    {
        idempotencyKey:{
            type:String,
            required:true,
            unique:true // to avoid duplicate entries,
        },
        reference:{
            type:String,
            required:true,
            unique:true,
        },
        status:{
            type:String,
            enum:["INITIATED", "PROCESSING", "SUCCESS", "FAILED"],
            default:"INITIATED",
            required:true,
        },
        lines:{
            type:[transactionLineSchema],
            validate:[
                function(val){
                    return val.length>=2;
                },
                "A double-entry transaction must contain at least 2 entries (one debit, one credit)."
            ]
        },
        metadata: {
            type: Map,
            of: String
        },
    },
    { timestamps: true }
);

// Pre-save database hook: Ensure total debits and credits match zero perfectly before completing
transactionSchema.pre("save", function () {
    if (this.status === "SUCCESS") {
        const totalSum = this.lines.reduce((sum, line) => sum + line.amount, 0);
        if (totalSum !== 0) {
            throw new Error(`Ledger imbalance! Transaction entries sum to ${totalSum}, must balance to 0.`);
        }
    }
});


module.exports = mongoose.model("Transaction",transactionSchema);
