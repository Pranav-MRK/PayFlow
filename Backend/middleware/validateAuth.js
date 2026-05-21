const AppError = require("../errors/appErr");

const ValidateAuth =(req,res,next)=>{
    const {email,password} = req.body;
    if (!email||!password) {
        throw new AppError("Incomplete credatials!",400);
    }
    next();
}
module.exports = ValidateAuth;