const express = require("express");
const router = express.Router();

const { getAllMovies, getMovie, updateMovie } = require("../controllers/movies");

// router.route('/').post(createJob).get(getAllJobs)
// router.route('/:id').patch(updateJob).get(getJob).delete(deleteJob)

router.route("/").get(getAllMovies);
router.route("/:id").get(getMovie).patch(updateMovie);

module.exports = router;
