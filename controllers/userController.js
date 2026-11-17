function getProfile(req, res) {
    return res.json({
        message: "Welcome to your profile",
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        }
    });
}

function getAdminDashboard(req, res) {
    return res.json({
        message: "Welcome, admin!",
        loggedInAs: req.user.username
    });
}

module.exports = { getProfile, getAdminDashboard };
