const catchAsync = require('../utils/catchAsync')
const axios = require('axios')

exports.getAllMovies = catchAsync(async (req, res, next) => {
    axios('https://swapi.dev/api/films')
        .then(response => {
            if (response.status === 200) {
                res.status(200).json({
                    message: 'success',
                    movies: response.data.results
                })
            }
        }).catch(err => {
            res.status(404).json({
                message: 'No movies were found.'
            })
        })
})

exports.getMovie = catchAsync(async (req, res, next) => {
    // http://localhost:8000/api/v1/movies/:searchTerm/?page=1&=gender=male&sort=age:desc
    // 1) Initialize searchTerm, gender and sort from URL (if any)
    const { gender, sort, page } = req.query
    const { searchTerm } = req.params
    const batch = 30

    // PAGINATION FORMULA: 
    // SLICE FROM: (page - 1) * batchQuantity 
    // SLICE TO: page * batchQuantity

    // EXAMPLE 1)
    // page = 1
    // batchQuantity = 30
    // FROM: (page - 1) * batchQuantity = 0 * 30 = 0 
    // TO: page * batchQuantity = 1 * 30 -- 0/30 

    // EXAMPLE 2)
    // page = 2
    // batchQuantity = 30
    // FROM: (page - 1) = 1 * batchQuantity = 1 * 30 = 30
    // TO page * batchQuantity = 2 * 30 = 60 -- 30/60

    // 2) Perform request
    axios(`https://swapi.dev/api/films/?search=${searchTerm}`)
        .then(async response => {
            // 1a) Request to a movie returns an array of character urls, so we store them
            const movieCharacterUrls = response.data.results[0].characters.slice((page - 1) * batch, page * batch)
            let characters = []

            // 1b) We perform an api call to each character individualy and store it in our characters array
            // example: https://swapi.dev/api/people/1/ --> axios(characterUrl)
            await Promise.all(
                movieCharacterUrls.map(async characterUrl => {
                    const character = await axios(characterUrl)

                    characters.push(character.data)

                    // Gender filtering
                    if (gender) {
                        characters = characters.filter(el => el.gender === gender)
                    }

                    // Sorting
                    if (sort) {
                        // 1a) split sort (height:asc)
                        const sorter = sort.split(':')
                        // 1b) height | age
                        const sortingKey = sorter[0]
                        // 1c) desc | asc
                        const sortingOrder = sorter[1]

                        characters = characters.sort((a, b) => {
                            if (sortingOrder === 'asc') {
                                return +a[sortingKey] - +b[sortingKey]
                            } else {
                                return +b[sortingKey] - +a[sortingKey]
                            }
                        })
                    }
                })
            )

            // 2) If everything went ok, send the response to client, otherwise handle the error
            res.status(200).json({
                message: 'success',
                results: characters.length,
                characters
            })
        }).catch(err => {
            res.status(500).json({
                message: 'Something went wrong!'
            })
        })

})
