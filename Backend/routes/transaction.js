const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transactionController");
const auth = require("../middleware/auth");
const restrictTo = require("../middleware/authoraization"); 

// Protect all routes below this line - user must be logged in
router.use(auth);
router.get("/me", transactionController.getMyTransactions);

// Changed route to "/transfer" to match your transaction controller's action name cleanly
router.post("/transfer", restrictTo("MERCHANT"), transactionController.transfer);

module.exports = router;