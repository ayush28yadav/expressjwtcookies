const express = require("express");
const {
    loginWithSession,
    getSessionProfile,
    logoutSession
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/login", loginWithSession);
router.get("/profile", getSessionProfile);
router.post("/logout", logoutSession);

module.exports = router;
