const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController")

// GET all movies
router.get("/", movieController.getAllMovies);

// GET one movie by ID
router.get("/:id", movieController.getMovieById);

// POST a movie
router.post("/", movieController.createMovie);

// PUT a movie
router.put("/:id", movieController.updateMovie);

// DELETE a movie
router.delete("/:id", movieController.deleteMovie);

module.exports = router;