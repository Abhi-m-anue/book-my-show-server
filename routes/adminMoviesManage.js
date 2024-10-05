const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movies");

router.route("/").post(createMovie).get(getAllMovies);
router.route("/:id").patch(updateMovie).get(getMovie).delete(deleteMovie);

module.exports = router;
