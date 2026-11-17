const express = require("express");
const { getProfile, getAdminDashboard } = require("../controllers/userController");
const { authenticateToken, allowRoles } = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.get("/admin", authenticateToken, allowRoles("admin"), getAdminDashboard);

module.exports = router;
