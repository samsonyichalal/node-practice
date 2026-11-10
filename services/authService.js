const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/jwt");

const SALT_ROUNDS = 12;

async function registerUser(data) {
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
    `;

    try {
        const [result] = await pool.query(query, [data.username, data.email, passwordHash]);

        return {
            id: result.insertId,
            username: data.username,
            email: data.email
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const conflictError = new Error(
                "Username or email is already registered"
            );

            conflictError.statusCode = 409;

            throw conflictError;
        }

        throw error;
    }
}


async function loginUser(data) {
    const query = `
        SELECT id, username, email, password_hash, role
        FROM users
        WHERE email = ?
    `;

    const [rows] = await pool.query(query, [data.email]);

    const user = rows[0];

    const passwordMatches = user 
        ? await bcrypt.compare(data.password, user.password_hash)
        : false;

    if (!passwordMatches) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = generateAccessToken(user);

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    };
}

module.exports = {
    registerUser,
    loginUser
}