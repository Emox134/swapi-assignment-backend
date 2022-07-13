const express = require('express')
const app = express()

// routers
const movieRouter = require('./routers/movieRouter')

const PORT = 8000 || 5000

app.use('/api/v1/movies', movieRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`)
})
