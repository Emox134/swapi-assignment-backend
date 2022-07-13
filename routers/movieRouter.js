const express = require('express')
const movieController = require('../controllers/movieController')

const router = express.Router()

// router.route('/')
//     .get(movieController.getAllMovies)

// EXCERCISE 1)
// http://localhost:8000/api/v1/movies/:movieId/:gender/:sort

router.route('/:searchTerm')
    .get(movieController.getMovie)

module.exports = router