const Movie = require("../models/Movie");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllMovies = async (req, res) => {
  const movies = await Movie.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ movies, count: movies.length });
};

const getMovie = async (req, res) => {
  const {
    params: { id: movieId },
  } = req;

  const movie = await Movie.findOne({
    _id: movieId,
  });
  if (!movie) {
    throw new NotFoundError(`No Movie with id ${movieId}`);
  }
  res.status(StatusCodes.OK).json({ movie });
};

const createMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(StatusCodes.CREATED).json({ movie });
};

const updateMovie = async (req, res) => {
  const {
    body: { name, seatIndex, status, price },
    user: { role },
    params: { id: movieId },
  } = req;

  const existingMovie = await Movie.findOne({ _id: movieId });
  if (!existingMovie) {
    throw new NotFoundError(`No Movie with id ${movieId}`);
  }

  if (role === "admin") {
    // admin can change name or price of movie
    if (!name) {
      throw new BadRequestError("Movie name cannot be empty");
    }
    const update = { name };
    if (price) {
      update.price = price;
    }
    const movie = await Movie.findOneAndUpdate({_id: movieId}, update, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).json({ movie });
  }

  //booking by user
  else {
    var update = {
      $set: {
        [`seats.${seatIndex}.status`]: status,
      },
    };

    const movie = await Movie.findOneAndUpdate(
      {
        _id: movieId,
        [`seats.${seatIndex}.status`]: "available", // Check if the seat is still available
      },
      update,
      { new: true, runValidators: true }
    );

    if (!movie) {
      throw new NotFoundError(`The seat is already booked`);
    }

    res.status(StatusCodes.OK).json({ movie });
  }
};

const deleteMovie = async (req, res) => {
  const {
    params: { id: movieId },
  } = req;

  const movie = await Movie.findByIdAndDelete({
    _id: movieId,
  });
  if (!movie) {
    throw new NotFoundError(`No Movie with id ${movieId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
