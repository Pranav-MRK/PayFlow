const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../models/User");         // Verifying your Day 1 User schema
const Account = require("../models/Account");   // Verifying your Day 2 Account schema

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedDatabase = async () => {
    try {
        // Connect to your MongoDB instance
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/payflow");
        console.log("🔌 Database connection established for seeding...");

        // 1. Wipe out existing accounts and users to ensure a clean slate test
        await Account.deleteMany();
        await User.deleteMany();
        console.log("🧹 Existing sandbox data wiped clean.");

        // 2. Provision Mock Merchant A (The Sender)
        const hashedPassword = await bcrypt.hash("password123", 10);
        const merchantA = await User.create({
            name: "Rahul Sharma",
            email: "rahul@payflow.test",
            password: hashedPassword,
            role: "MERCHANT"
        });

        // 3. Provision Mock Merchant B (The Receiver)
        const merchantB = await User.create({
            name: "Pranav Kumbhar",
            email: "pranav@payflow.test",
            password: hashedPassword,
            role: "MERCHANT"
        });

        console.log("👥 Mock Merchants provisioned successfully.");

        // 4. Provision initial Primary Wallets with minor units (100,000 paise = ₹1,000)
        await Account.create([
            {
                userId: merchantA._id,
                name: "Primary Wallet",
                type: "LIABILITY",
                currency: "INR",
                balance: 100000, // ₹1,000 starter funds
                Status: "ACTIVE"
            },
            {
                userId: merchantB._id,
                name: "Primary Wallet",
                type: "LIABILITY",
                currency: "INR",
                balance: 0, // ₹0 starter funds
                Status: "ACTIVE"
            }
        ]);

        console.log("💰 Digital wallets provisioned with starter funds.");
        console.log(`
  SANDBOX SEEDING COMPLETE!
─────────────────────────────────────────
Sender Merchant (Rahul):
  • ID: ${merchantA._id}
  • Email: rahul@payflow.test
  • Initial Balance: ₹1,000 (100000 paise)

Receiver Merchant (Pranav):
  • ID: ${merchantB._id}
  • Email: pranav@payflow.test
  • Initial Balance: ₹0 (0 paise)
─────────────────────────────────────────
        `);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed dramatically:", error);
        process.exit(1);
    }
};

seedDatabase();
