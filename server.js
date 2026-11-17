const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// The browser keeps only a session ID; Express stores session data on the server.
// 
app.use(session({
    secret: process.env.SESSION_SECRET || "development",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}));

app.use(authRoutes);
app.use(userRoutes);
app.use("/session", sessionRoutes);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
