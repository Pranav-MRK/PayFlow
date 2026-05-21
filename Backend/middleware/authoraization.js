// Role based Auth
const AppError = require("../errors/appErr");

module.exports = (...allowedRoles)=>{
    return(req,res,next)=>{
        if (!req.user || !req.user.role) {
            return next(new AppError("Access denied: User profile context missing", 403));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError("Access forbidden: Insufficient administrative privileges", 403));
        }
        next();
    }

}
