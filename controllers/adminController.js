const adminService = require("../services/adminService");

async function getAllUsers(req, res, next) {
    try {
        const users = await adminService.getAllUsers();

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });

    } catch (error) {
        next(error);
    }
}

// GET all movies
async function getAllMovies(req, res, next) {
    try {
        const rows = await adminService.getAllMovies();

        return res.status(200).json({
            success: true,
            message: "All movies retrieved successfully",
            data: rows
        });

    } catch (error) {
        next(error);
    }
}


// GET one movie by ID
async function getMovieById(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Movie ID must be a positive integer"
            });
        }

        const rows = await adminService.getMovieById(id);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie retrieved successfully",
            data: rows
        });

    } catch (error) {
        next(error);
    }
}


// DELETE any movie
async function deleteMovie(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Movie ID must be a positive integer"
            });
        }

        const deleted = await adminService.deleteMovie(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie deleted successfully",
            data: {
                id
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsers,
    getAllMovies,
    getMovieById,
    deleteMovie
};