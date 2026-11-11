const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");

router.use(authenticateToken, authorizeRole("admin"));

router.get("/users", adminController.getAllUsers);
router.get("/movies", adminController.getAllMovies);
router.get("/movies/:id", adminController.getMovieById);
router.delete("/movies/:id", adminController.deleteMovie);

module.exports = router;