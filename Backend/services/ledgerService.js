const mongoose = require("mongoose");
const transactionRepository = require("../repositories/transactionRepository");
const accountRepository = require("../repositories/accountRepository");
const AppError = require("../errors/appErr");
const UserRepository = require("../repositories/userRepository");
const userRepository = require("../repositories/userRepository");


class LedgerService{
    async supportsMongoTransactions() {
        const hello = await mongoose.connection.db.admin().command({ hello: 1 });
        return Boolean(hello.setName || hello.msg === "isdbgrid");
    }
    async getMyTransactions (userId,{page, limit}){
        const accounts = await accountRepository.findByUserId(userId);
        const accountIds = accounts.map((account) => account._id);

        if (accountIds.length === 0) {
            return{
                transactions:[],
                pagination:{
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                },
            };
        }
        const {transactions,total} = await transactionRepository.findByAccountIds(accountIds,{page,limit});
        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

    }
    
    

    async executeTransfer({ senderUserId, receiverUserId, amount, currency, idempotencyKey, reference }, session = null) {
        const sourceAccount = await accountRepository.findOrCreatePrimaryWallet(senderUserId, currency, 0, session);
        const targetAccount = await accountRepository.findOrCreatePrimaryWallet(receiverUserId, currency, 0, session);

        if(!sourceAccount) throw new AppError("Sender account not found.",404);
        if(!targetAccount) throw new AppError("Receiver account not found.",404);

        if(sourceAccount.balance < amount){
            throw new AppError("Insufficient funds to complete this transaction!",400);
        }

        const ledgerLines = [
            { accountId: sourceAccount._id, amount: -amount, description: `Transfer out to reference ${reference}` },
            { accountId: targetAccount._id, amount: amount, description: `Transfer in from reference ${reference}` }
        ];

        const pendingTx = await transactionRepository.createTransaction({
            idempotencyKey,
            reference,
            status: "PROCESSING",
            lines: ledgerLines,
        }, session);

        await accountRepository.updateBalance(sourceAccount._id, -amount, session);
        await accountRepository.updateBalance(targetAccount._id, amount, session);

        const finalizedTx = await transactionRepository.updateStatus(pendingTx._id, "SUCCESS", null, session);
        return { message: "Transfer successful", transaction: finalizedTx };
    }

    async transferFunds({senderUserId,receiverUserId,amount,currency,idempotencyKey}){
        if(amount <=0){
            throw new AppError("Transfer Amount must be greater than the zero",400);
        }

        const reciver = await userRepository.findUserById(receiverUserId);
        if (!reciver) {
            throw new AppError("Reciver not found...",404);
        }
        

        //  check duplicate request 

        const existingTR = await transactionRepository.findByIdempotencyKey(idempotencyKey);
        if (existingTR) {
            return {
                message:"Duplicate request is found.Returning previously processed transaction.",
                transaction:existingTR,
                duplicate:true,
            }

        }

        // if no duplicate enteries found we can make new payment transations clear

        // Generate a clean payment tracking reference string
        const reference = `tx_Buffer${Buffer.from(idempotencyKey).toString("hex").slice(0,12)}`;

        const transferData = { senderUserId, receiverUserId, amount, currency, idempotencyKey, reference };
        const canUseTransactions = await this.supportsMongoTransactions();
        if (!canUseTransactions) {
            const result = await this.executeTransfer(transferData);
            return {
                ...result,
                transactionMode: "standalone",
                warning: "MongoDB is not running as a replica set, so this transfer was processed without a database transaction."
            };
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const result = await this.executeTransfer(transferData, session);
            await session.commitTransaction();
            return {
                ...result,
                transactionMode: "transaction"
            };
        } catch (error) {
            await session.abortTransaction();
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
