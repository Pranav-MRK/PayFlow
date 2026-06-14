const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/validateUser");
const userController = require("../controller/userController");
const restrictTo = require("../middleware/authoraization");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", restrictTo("ADMIN", "AUDITOR"), userController.getUsers);
router.post("/", restrictTo("ADMIN"), validateUser, userController.createUser);
router.get("/:id", restrictTo("ADMIN", "AUDITOR", "MERCHANT"), userController.getUserById);

module.exports = router;