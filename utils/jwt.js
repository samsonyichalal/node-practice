const jwt =require("jsonwebtoken");

function getJwtSecret() {

    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return secret;
}

function generateAccessToken(user) {
    return jwt.sign(
        {
            role: user.role
        }, 
        getJwtSecret(), 
        {
            algorithm: "HS256",
            subject: String(user.id),
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );
}

function verifyAccessToken(token){
    return jwt.verify(
        token,
        getJwtSecret(),
        {
            algorithms: ["HS256"]
        }
    );
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
}