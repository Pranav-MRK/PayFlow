// LedgerService that wraps the payment execution loop inside a true MongoDB ACID transaction.

const mongoose = require("mongoose");
const transactionRepository = require("../repositories/transactionRepository");
const accountRepository = require("../repositories/accountRepository");
const AppError = require("../errors/appErr");
const Account = require("../models/Account");


class LedgerService{
    // Executes a bulletproof atomic peer-to-peer transfer between two digital pockets


    async transferFunds({senderUserId,reciverUserId,amount,currency,idempotencyKey}){
        if(amount <=0){
            throw new AppError("Transfer Amount must be greater than the zero",400);
        }

        //  check duplicate request 

        const existingTR = await transactionRepository.findByIdempotencyKey(idempotencyKey);
        if (existingTR) {
            return {
                message:"Duplicate request is found.Returning previously processed transaction.",
                transatiction:existingTR,
                duplicate:true,
            }

        }

        // if no duplicate enteries found we can make new payment transations clear

        // Generate a clean payment tracking reference string
        const reference = `tx_Buffer${Buffer.from(idempotencyKey).toString("hex").slice(0,12)}`;

        // 2. Initialize our master ACID Transaction Safety Bubble

        const session = await mongoose.startSession();

        session.startTransaction();


        try {
            // 3. Locate both financial pockets inside the session bubble
            const sourceAccount = await accountRepository.findByNameAndCurrency(senderUserId,'Primary Wallet',currency,session);
            const targetAccount = await accountRepository.findByNameAndCurrency(reciverUserId,'Primary Wallet',currency,session);


            if(!sourceAccount) throw new AppError("Sender account not found.",404);
            if(!targetAccount) throw new AppError("Reciver account not found.",404);


            // check if sender have enough cash 
            if(sourceAccount.balance < currency){
                throw new AppError("Insufficient funds to complete this transaction!",400);
            }

            // Initialize an audit trail log in state: INITIATED

            const ledgerLines = [
                { accountId: sourceAccount._id, amount: -amount, description: `Transfer out to reference ${reference}` }, // Credit
                { accountId: targetAccount._id, amount: amount, description: `Transfer in from reference ${reference}` }   // Debit
            ];

            const pendingTx = await transactionRepository.createTransaction({
                idempotencyKey,
                reference,
                status: "PROCESSING",
                lines: ledgerLines,
            },session);


            // 6. Execute atomic balance updates inside the session bubble
            await accountRepository.updateBalance(sourceAccount._id, -amount, session);
            await accountRepository.updateBalance(targetAccount._id, amount, session);

            // Update transaction log status to SUCCESS (Triggers the zero-sum verification hook!)
            const finalizedTx = await transactionRepository.updateStatus(pendingTx._id, "SUCCESS", null, session);
            // 8. Everything passed seamlessly! Commit changes permanently to the database disk
            await session.commitTransaction();
            return { message: "Transfer successful", transaction: finalizedTx };
        } catch (error) {
            await session.abortTransaction(); // anything went wrong return it back all things be at normal mode 
            // Log the failure to the database ledger audit history for transparency
            try {
                await transactionRepository.createTransaction({
                    idempotencyKey,
                    reference,
                    status: "FAILED",
                    lines: []
                });
            } catch (logError) {
                // Ignore secondary logging failures to avoid masking the primary error
            }
            throw error;
        }
        finally{
            session.endSession();
        }

    }
}

module.exports = new LedgerService();