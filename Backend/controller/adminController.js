const Account = require("../models/Account");
const transaction = require("../models/Transaction");
const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../errors/appErr");
const Transaction = require("../models/Transaction");

exports.getSystemHealthReport = asyncWrapper(async(req,res,next)=>{
    const balanceSummary = await Account.aggregate([
        {  // add all balance to the one single group with this $group with similar currency
            $group:{
                _id:"$currency",
                // sums all balance inside the group....
                totalVolume:{$sum:"$balance"},
                // for keeping count of every group acc-1 count++; to matain count ,
                activeWalletsCounts:{$sum:1}

            }
        }
    ])

    const totalTransaction = await Transaction.countDocuments();
    // got report here know return clean report from here 

    res.status(200).json({
        status:"success",
        timestamp:new Date(),
        data:{
            name:"PayFlow System",
            totalTransactionexecuted : totalTransaction,
            currencyLedgery:balanceSummary,
        }
        
    })
})

// to get all past transactions 
exports.getGlobalAuditFeed = asyncWrapper(async(req,res,next)=>{
    const masterlog = await transaction.find()
                           .sort({createdAt:-1})
                           .limit(100);
    
    res.status(200).json({
        status:'success',
        recourdCount: masterlog.length,
        data:masterlog,
    })   
})