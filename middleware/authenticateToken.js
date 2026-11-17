const jwt = require("jsonwebtoken");
const users = require("../data/users");

const JWT_SECRET = process.env.JWT_SECRET || "my-secret";

function authenticateToken(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Please log in first"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token. Please log in again."
        });
    }

    if (!decoded || typeof decoded !== "object" || !Number.isInteger(decoded.id)) {
        return res.status(401).json({
            message: "Invalid or expired token. Please log in again."
        });
    }

    const currentUser = users.find((user) => user.id === decoded.id);

    if (!currentUser) {
        return res.status(401).json({
            message: "User no longer exists. Please log in again."
        });
    }

    const { id, username, role } = currentUser;
    req.user = { id, username, role };
    return next();
}

function allowRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to access this route"
            });
        }

        return next();
    };
}

module.exports = { authenticateToken, allowRoles };
