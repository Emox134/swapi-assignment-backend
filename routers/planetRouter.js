const express = require('express')
const planetController = require('../controllers/planetController')

const router = express.Router()

router.route('/')
    .get(planetController.getPlanets)

module.exports = router