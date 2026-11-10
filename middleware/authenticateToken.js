const { verifyAccessToken} = require("../utils/jwt");

function authenticateToken(req, res, next) {

    const authorizeHeader = req.headers.authorization;

    if (!authorizeHeader || !authorizeHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is required"
        });
    }

    const token = authorizeHeader.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is required"
        });
    }

    try {
        const payload = verifyAccessToken(token);

        const userId = Number(payload.sub);

        if (
            !Number.isSafeInteger(userId) ||
            userId <= 0 ||
            typeof payload.role !== "string"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        req.user = {
            id: userId,
            role: payload.role
        };

        next();

    } catch (error) {

        if (error.message === "JWT_SECRET is not configured") {
            return next(error);
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
}

module.exports = authenticateToken;