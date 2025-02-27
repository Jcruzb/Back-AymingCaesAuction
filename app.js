require('./config/db.config')
require('dotenv').config()

const express = require('express')
const loger = require('morgan')
const cors = require('cors')
const HttpStatus = require('http-status-codes')

const app = express()

app.use(cors())
app.use(loger('dev'))
app.use(express.json())

app.get('/', (req, res, next)=>{ res.status(HttpStatus.StatusCodes.OK).send('Hola mundo de los dulces')})

//Rutas
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const auctionRoutes = require('./routes/auction.routes')
const bidRoutes = require('./routes/bid.routes')
const projectRoutes = require('./routes/project.routes')
const standarProjectRoutes = require('./routes/standarProject.routes')

const PORT = process.env.PORT

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})