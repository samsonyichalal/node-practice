const movieService = require("../services/movieService");

// GET all movies
async function getAllMovies(req, res, next) {
    try {
        const rows = await movieService.getAllMovies();

        return res.status(200).json({
            success: true,
            message: "Movies retrieved successfully",
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

        const row = await movieService.getMovieById(id);

        if (row.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie retrieved successfully",
            data: row
        });

    } catch (error) {
        next(error);
    }
}


// CREATE movie
async function createMovie(req, res, next) {
    try {
        const { name, author, description } = req.body || {};

        if (
            typeof name !== "string" || name.trim() === "" ||
            typeof author !== "string" || author.trim() === "" ||
            typeof description !== "string" || description.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, author, and description must all be non-empty strings"
            });
        }

        const data = {
            name: name.trim(),
            author: author.trim(),
            description: description.trim()
        };

        const movie = await movieService.createMovie(data);

        return res.status(201).json({
            success: true,
            message: "Movie created successfully",
            data: {
                id: movie.id
            }
        });

    } catch (error) {
        next(error);
    }
}


// UPDATE movie
async function updateMovie(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Movie ID must be a positive integer"
            });
        }

        const { name, author, description } = req.body || {};

        if (
            typeof name !== "string" || name.trim() === "" ||
            typeof author !== "string" || author.trim() === "" ||
            typeof description !== "string" || description.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, author, and description must all be non-empty strings"
            });
        }

        const data = {
            name: name.trim(),
            author: author.trim(),
            description: description.trim()
        };

        const movie = await movieService.updateMovie(id, data);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movie updated successfully",
            data: {
                id: movie.id
            }
        });

    } catch (error) {
        next(error);
    }
}


// DELETE movie
async function deleteMovie(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Movie ID must be a positive integer"
            });
        }

        const deleted = await movieService.deleteMovie(id);

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
                id: id
            }
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie
};