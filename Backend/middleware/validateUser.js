const AppError = require("../errors/appErr");
const Joi = require('joi');

module.exports = (req,res,next)=>{
    const schema = Joi.object({
        name:Joi.string().min(2).max(50).required().trim(),
        email:Joi.string().email({ tlds: { allow: false } }).required().lowercase().trim(),
        password:Joi.string().min(6).required(),
        role: Joi.string().trim().uppercase().valid("MERCHANT", "ADMIN", "AUDITOR").default("MERCHANT")
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    req.body = value; // Assign cleaned data
    next();
}
