const express = require('express')
const movieController = require('../controllers/movieController')

const router = express.Router()

router.route('/:searchTerm')
    .get(movieController.getMovie)

module.exports = router