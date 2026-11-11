const pool = require("../config/db");

// reusable transition function
async function transaction(callback) {
    let connection;
    let transactionStarted = false;
    let connectionBroken = false;

    try {
        connection = await pool.getConnection();

        await connection.beginTransaction();
        transactionStarted = true;

        const result = await callback(connection);

        await connection.commit();
        transactionStarted = false;

        return result;

    } catch (error) {

        if (error.fatal) {
            connectionBroken = true;
        }

        if (connection && transactionStarted && !connectionBroken) {
            try {
                await connection.rollback();
                transactionStarted = false;

            } catch (rollbackError) {
                console.error(
                    "Rollback failed:",
                    rollbackError.message
                );

                connectionBroken = true;
            }
        }

        throw error;

    } finally {
        if (connection) {
            if (connectionBroken) {
                connection.destroy();
            } else {
                connection.release();
            }
        }
    }
}

// get all movies
async function getAllMovies(userId) {
    const query = `
        SELECT movie.id, movie.name, movie.author, description.description
        FROM movie LEFT JOIN description
        ON movie.id = description.movie_id
        WHERE movie.user_id = ?
        ORDER BY movie.id, description.id
    `;

    const [rows] = await pool.query(query, [userId]);

    return rows;
}

// get movie by id
async function getMovieById(id, userId) {
    const query = `
        SELECT movie.id, movie.name, movie.author, description.description
        FROM movie LEFT JOIN description
        ON movie.id = description.movie_id
        WHERE movie.id = ? AND movie.user_id = ?
        ORDER BY description.id
    `;

    const [rows] = await pool.query(query, [id, userId]);

    return rows;
}

// post movie
async function createMovie(data, userId) {
    return transaction(async (connection) => {
        const query = `
        INSERT INTO movie (name, author, user_id) 
        VALUES (?, ?, ?)
        `;

        const [result] = await connection.query(query, [data.name, data.author, userId]);
        const id = result.insertId;

        const insertDescription = `
        INSERT INTO description (description, movie_id)
        VALUES (?, ?)
        `;

        await connection.query(insertDescription, [data.description, id]);
        return { id };
    });
}

// update movie
async function updateMovie(id, data, userId){
    return transaction(async (connection) => {
        const [movie] = await connection.query(`
        SELECT movie.id 
        FROM movie
        WHERE id = ? AND user_id = ?
        `, [id, userId]);
        
        if(movie.length === 0){
            return null;
        }

        const updateMovieQuery = `
        UPDATE movie 
        SET name = ?, author = ?
        WHERE id = ? AND user_id = ?
        `;

        await connection.query(updateMovieQuery, [data.name, data.author, id, userId])

        const[description] = await connection.query(`
            SELECT id FROM description
            WHERE movie_id = ?
            `, [id])

        if(description.length === 0) {
            await connection.query(`
                INSERT INTO description (description, movie_id)
                VALUES (?, ?)
                `, [data.description, id])
        } else {
            await connection.query(`
            UPDATE description 
            SET description = ?
            WHERE movie_id = ?
            `, [data.description, id])
        }   
        return { id }
    });
}

// Delete movie
async function deleteMovie(id, userId) {
    const movie = `
        DELETE FROM movie
        WHERE id = ? AND user_id = ?
    `;
    const [result] = await pool.query(movie, [id, userId]);

    return result.affectedRows > 0;
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};
