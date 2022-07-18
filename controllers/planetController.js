const catchAsync = require('../utils/catchAsync')
const axios = require('axios')

exports.getPlanets = catchAsync(async (req, res, next) => {
    const { climateType } = req.query

    axios('https://swapi.dev/api/planets')
        .then(async response => {
            if (response.status === 200) {
                const planets = response.data.results
                const residentUrls = response.data.results[0].residents
                let residents = []

                if (climateType) {
                    const updatedPlanets = planets.filter(planet => planet.climate === climateType)

                    await Promise.all(
                        residentUrls.map(async residentUrl => {
                            const resident = await axios(residentUrl)
                            residents.push(resident.data)
                            residents = residents.filter(resident => resident.hair_color === 'black')
                        })
                    )

                    res.status(200).json({
                        message: 'success',
                        planetResults: updatedPlanets.length,
                        residentResults: residents.length,
                        planets: updatedPlanets,
                        residents
                    })
                } else {
                    res.status(200).json({
                        message: 'success',
                        results: planets.length,
                        planets
                    })
                }
            }
        }).catch(err => {
            console.log(err)
            res.status(404).json({
                message: 'There was a problem with your request.'
            })
        })
})