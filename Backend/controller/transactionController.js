const asyncWrapper = require("../utils/asyncWrapper");
const LedgerService = require("../services/ledgerService");
const AppError = require("../errors/appErr");
class TransactionController{
    transfer = asyncWrapper(async(req,res,next)=>{
        console.log("=== DEBUGGING TRANSFER ENDPOINT ===");
        console.log("Raw req.body contents:", req.body);
        console.log("Authenticated req.user context:", req.user);
        const { receiverUserId, amount, currency, idempotencyKey } = req.body;

        // user details extracting

        const senderUserId = req.user.id;

        // validation check 
        if(!receiverUserId || !amount || !currency || !idempotencyKey){
            return next(new AppError("Parameters are not complete!!", 400));

        }

        const transferAmount = Number(amount);
        if(!Number.isFinite(transferAmount) || transferAmount <= 0){
            return next(new AppError("Amount must be a number greater than zero", 400));
        }

        if(senderUserId === receiverUserId){
            return next(new AppError("Receiver and sender user id are same!!", 400));
        }

        const result = await LedgerService.transferFunds({
            senderUserId,
            receiverUserId,
            currency: currency.toUpperCase(),
            idempotencyKey,
            amount: transferAmount,
        })
        res.status(200).json({
            status:"Success",
            data:result,
        })
    });
}

module.exports = new TransactionController();
