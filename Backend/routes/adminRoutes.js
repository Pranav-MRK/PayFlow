const express = require('express');
const router = express.Router();
const validateUser = require("../middleware/validateUser");
const userController = require("../controller/userController");
const restrictTo = require("../middleware/authoraization");
const auth = require("../middleware/auth");
const adminController = require("../controller/adminController");

router.use(auth);
router.use(restrictTo('Admin'));
router.get("/system-health",adminController.getSystemHealthReport);
router.get("/audit-feed",adminController.getGlobalAuditFeed);

module.exports = router;

