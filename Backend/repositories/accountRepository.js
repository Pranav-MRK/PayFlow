const Account = require("../models/Account");

class AccountRepository {
    // Create a new wallet pocket for a user
    async createAccount(accountData, session = null) {
        const account = new Account(accountData);
        return await account.save({ session });
    }

    // Find a specific account by its unique ID
    async findById(accountId, session = null) {
        return await Account.findById(accountId).session(session);
    }

    // Find all financial accounts belonging to a single user
    async findByUserId(userId) {
        return await Account.find({ userId });
    }

    // Find an account by user ID and name (e.g., finding Rahul's "Primary Wallet")
    async findByNameAndCurrency(userId, name, currency, session = null) {
        return await Account.findOne({ userId, name, currency }).session(session);
    }

    // Atomic update to change a wallet balance safely
    async updateBalance(accountId, amount, session = null) {
        return await Account.findByIdAndUpdate(
            accountId,
            { $inc: { balance: amount } }, // $inc handles mathematical addition/subtraction safely in MongoDB
            { new: true, runValidators: true, session }
        );
    }
}

module.exports = new AccountRepository();