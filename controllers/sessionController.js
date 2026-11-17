const bcrypt = require("bcrypt");
const users = require("../data/users");

// Check credentials, then save the logged-in user's public details in the session.
async function loginWithSession(req, res) {
    const { username, password } = req.body || {};

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // bcrypt compares the submitted password with the stored hash without
    // storing or recovering the original password.
    const user = users.find((candidate) => candidate.username === username);
    const passwordMatches = user && await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // The session data stays on the server; the browser receives its session ID.
    req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    return res.json({
        message: "Login successful",
        user: req.session.user
    });
}

function getSessionProfile(req, res) {
    // Check whether a user session exists, just like the basic session example.
    if (!req.session.user) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    return res.json({
        message: "Welcome to your profile!",
        user: req.session.user
    });
}

function logoutSession(req, res) {
    // Destroy the server-side session, then remove its browser cookie.
    return req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Could not logout"
            });
        }

        res.clearCookie("connect.sid");

        return res.json({ message: "Logged out successfully" });
    });
}

module.exports = { loginWithSession, getSessionProfile, logoutSession };
