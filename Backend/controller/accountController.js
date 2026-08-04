const asyncWrapper = require("../utils/asyncWrapper");

const accountService = require("../services/accountService");

class AccountController{
    getMyAccounts = asyncWrapper(async(req,res) =>{
        const account = await accountService.getMyaccount(req.user.id);

        res.status(200).json({
            success: true,
            data:account,
        })
    })
}

module.exports = new AccountController();

