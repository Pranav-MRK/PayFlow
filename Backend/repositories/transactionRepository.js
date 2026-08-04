const Transaction = require("../models/Transaction");

class TransactionRepository {
    // Log the initial transaction record into the history books
    async createTransaction(transactionData, session = null) {
        const transaction = new Transaction(transactionData);
        return await transaction.save({ session });
    }
    async findByAccountIds(accountIds, { page, limit }) {
        const filter = {
            status: "SUCCESS",
            "lines.accountId": { $in: accountIds },
        };

        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("lines.accountId", "name currency userId"),

            Transaction.countDocuments(filter),
        ]);

        return { transactions, total };
    }

    // Find a transaction by its unique system reference tracking token (e.g., tx_12345)
    async findByReference(reference) {
        return await Transaction.findOne({ reference }).populate("lines.accountId");
    }

    // Look up an existing transaction by its unique Idempotency Key
    // This helps us see if a merchant is accidental double-submitting a request
    async findByIdempotencyKey(idempotencyKey) {
        return await Transaction.findOne({ idempotencyKey });
    }

    // Update the state machine status of a transaction (e.g., moving from PROCESSING to SUCCESS)
    async updateStatus(transactionId, status, lines = null, session = null) {
        const updateData = { status };
        if (lines) {
            updateData.lines = lines;
        }

        return await Transaction.findByIdAndUpdate(
            transactionId,
            { $set: updateData },
            { new: true, runValidators: true, session }
        );
    }
}

module.exports = new TransactionRepository();