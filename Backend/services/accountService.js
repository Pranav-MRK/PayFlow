const accountRepository = require("../repositories/accountRepository");

class AccountService{
    async getMyaccount(userId) {
        return accountRepository.findByUserId(userId);
    }
}

module.exports = new AccountService();