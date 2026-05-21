const joi = require('joi');
const AppError = require("../errors/appErr");
const Joi = require('joi');

module.exports = (req,res,next)=>{
    const schema = Joi.object({
        name:Joi.string().min(2).max(50).required().trim(),
        email:Joi.string().email().required().lowercase().trim(),
        password:Joi.string().min(6).required(),
        role: Joi.string().valid("MERCHANT", "ADMIN", "AUDITOR").default("MERCHANT")
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    req.body = value; // Assign cleaned data
    next();
}