const AppError = require("../errors/appErr");
const userService = require("../services/userService");
const asyncWrapper = require("../utils/asyncWrapper");

class UserController {
    // Register/Create a new user
    createUser = asyncWrapper(async (req, res, next) => {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    });


    getUsers = asyncWrapper(async (req, res, next) => {
        const users = await userService.getUsers(req.query);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    });
    getMyProfile = asyncWrapper(async (req, res) => {
        const user = await userService.getUserById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    });
    


    getUserById = asyncWrapper(async (req, res, next) => {
        const { id } = req.params;
        
        if (req.user.role === "MERCHANT" && req.user.id !== req.params.id) {
            return next(new AppError("You can only access your own profile", 403));
        }
        const user = await userService.getUserById(id);

        res.status(200).json({
            success: true,
            data: user
        });
    });
}

module.exports = new UserController();