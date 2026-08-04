require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const reqinfo = require("./middleware/reqinfo");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const app = express();

//  routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transaction');
const adminRoutes = require("./routes/adminRoutes");
const accountRoutes = require("./routes/accountRoutes");
const { connect } = require('mongoose');


//  middleware 
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:5173', 
        credentials: true
    })
);
app.use(logger);
app.use(reqinfo);

// 2. Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/accounts", accountRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/admin',adminRoutes);


connectDB();

// 3. 404 fallback for unknown routes
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// 4. Global Error Handling Middleware (Always last)
app.use(errorHandler);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Ledger Engine listening on port ${PORT}...!`);
});


