const pool = require("../config/db");

async function getAllUsers() {
    const query = `
        SELECT id, username, email, role, created_at
        FROM users
        ORDER BY id
    `;

    const [rows] = await pool.query(query);

    return rows;
}

// GET all movies across the platform
async function getAllMovies() {
    const query = `
        SELECT
            movie.id,
            movie.name,
            movie.author,
            movie.user_id AS owner_id,
            users.username AS owner_username,
            description.description
        FROM movie
        LEFT JOIN users
            ON movie.user_id = users.id
        LEFT JOIN description
            ON movie.id = description.movie_id
        ORDER BY movie.id, description.id
    `;

    const [rows] = await pool.query(query);
    return rows;
}


// GET any movie by ID
async function getMovieById(id) {
    const query = `
        SELECT
            movie.id,
            movie.name,
            movie.author,
            movie.user_id AS owner_id,
            users.username AS owner_username,
            description.description
        FROM movie
        LEFT JOIN users
            ON movie.user_id = users.id
        LEFT JOIN description
            ON movie.id = description.movie_id
        WHERE movie.id = ?
        ORDER BY description.id
    `;

    const [rows] = await pool.query(query, [id]);
    return rows;
}


// DELETE any movie by ID
async function deleteMovie(id) {
    const query = `
        DELETE FROM movie
        WHERE id = ?
    `;

    const [result] = await pool.query(query, [id]);

    return result.affectedRows > 0;
}

module.exports = {
    getAllUsers,
    getAllMovies,
    getMovieById,
    deleteMovie
};