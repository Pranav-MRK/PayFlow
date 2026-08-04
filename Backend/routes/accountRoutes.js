const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const accountController = require("../controller/accountController");

router.use(auth);

router.get("/me", accountController.getMyAccounts);

module.exports = router;