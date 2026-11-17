const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../data/users");

// Set a long, random JWT_SECRET in the environment outside this demo.
const JWT_SECRET = process.env.JWT_SECRET || "my-secret";

// bcrypt's cost controls how expensive each password hash is to calculate.
// Cost 12 takes roughly 2^12 work units; increase it as server capacity allows.
const BCRYPT_WORK_FACTOR = 12;

// Create an account and sign the new user in.
async function register(req, res) {
    const { username, password } = req.body || {};

    // Require non-empty string values; usernames are stored exactly as provided.
    if (
        typeof username !== "string" ||
        !username ||
        typeof password !== "string" ||
        !password
    ) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
        return res.status(409).json({
            message: "Username is already taken"
        });
    }

    // A hash is a one-way representation, not encrypted plaintext.
    // bcrypt generates a unique random salt and includes it and the cost in the hash.
    // The unique salt prevents rainbow tables from reusing precomputed hashes.
    // The work factor slows brute force (trying many combinations) and dictionary
    // attacks (trying likely or commonly used passwords) on stolen hashes.
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // Store only the hash; public endpoints never return the password field.
    const user = {
        id: users.length + 1,
        username,
        password: hashedPassword,
        role: "user"
    };

    users.push(user);

    // Issue a one-hour JWT containing the user's ID, not their password.
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "1h"
    });

    // HttpOnly blocks JavaScript access; Secure requires HTTPS in production;
    // SameSite=Lax restricts most cross-site cookie sending.
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });

    // Return only fields safe for the client to see.
    return res.status(201).json({
        message: "Registration successful",
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
}

// Verify credentials and issue an authentication cookie.
async function login(req, res) {
    const { username, password } = req.body || {};

    // Reject missing or non-string credentials.
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Compare the supplied password with the stored bcrypt hash; bcrypt uses
    // the salt and cost encoded in that hash to perform the comparison.
    const user = users.find((candidate) => candidate.username === username);
    const passwordMatches = user && await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Put only the user ID in the signed token; the middleware reloads current
    // user details when authenticating later requests.
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "1h"
    });

    // Use the same cookie settings as registration.
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });

    return res.json({
        message: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
}

// Remove the browser's authentication cookie.
function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    return res.json({ message: "Logged out successfully" });
}

module.exports = { register, login, logout };
