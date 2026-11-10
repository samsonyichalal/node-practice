const authService = require("../services/authService");

async function register(req, res, next) {
    try {
        const { username, email, password } = req.body || {};

        if (
            typeof username !== "string" ||
            username.trim().length < 3 ||
            username.trim().length > 50 ||
            !/^[a-zA-Z0-9_]+$/.test(username.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Username must contain 3-50 letters, numbers, or underscores"
            });
        }

        if (typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "A valid email address is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (
            normalizedEmail.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid email address is required"
            });
        }

        if (
            typeof password !== "string" ||
            password.length < 8 ||
            password.trim() === "" ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and no more than 72 UTF-8 bytes"
            });
        }

        const userData = {
            username: username.trim(),
            email: normalizedEmail,
            password
        };

        const user = await authService.registerUser(userData);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            email.trim() === "" ||
            typeof password !== "string" ||
            password.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const loginData = {
            email: email.trim().toLowerCase(),
            password
        };

        const user = await authService.loginUser(loginData);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

function getCurrentUser(req, res) {
    return res.status(200).json({
        success: true,
        message: "Authenticated user",
        data: req.user
    });
}

module.exports = {
    register, 
    login,
    getCurrentUser
};