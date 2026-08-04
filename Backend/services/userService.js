const AppError = require("../errors/appErr");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/jwt");
const userRepository = require("../repositories/userRepository");
const accountRepository = require("../repositories/accountRepository");

class UserService {
    // 1. Create User
    async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword
        });

        if (user.role === "MERCHANT") {
            await accountRepository.findOrCreatePrimaryWallet(user._id, "INR", 0);
        }
        
        // Convert to object and remove password
        const userObj = user.toObject();
        delete userObj.password;
        
        return userObj;

    }

    // 2. Get All Users (with pagination)
    async getUsers(queryParams) {
        const { page = 1, limit = 10, sort, order } = queryParams;
        return await userRepository.findUsers({
            page: Number(page),
            limit: Number(limit),
            sort,
            order
        });
    }

    // 3. Get User By ID
    async getUserById(id) {
        const user = await userRepository.findUserById(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return user;
    }

    // 4. Register User (Hash password + Save)
    async registerUser(userData) {
        const { email, password } = userData;
        
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new AppError("User already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword
        });

        if (user.role === "MERCHANT") {
            await accountRepository.findOrCreatePrimaryWallet(user._id, "INR", 0);
        }
        if(user.role == "ADMIN"){
            throw new AppError("Admin role cannot be given...!",400);
        }

        return user;
    }

    // 5. Login User (Verify + Token)
    async loginUser({ email, password }) {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }

        if (user.role === "MERCHANT") {
            await accountRepository.findOrCreatePrimaryWallet(user._id, "INR", 0);
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        // Remove password from response
        user.password = undefined;
        console.log(user);

        return { token, user };
    }
}

module.exports = new UserService();
