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

app.get('/', (req, res, next) => { res.status(HttpStatus.StatusCodes.OK).send('Hola mundo del vicio de las subastas') })

//Rutas
const userRoutes = require('./routes/user.routes')
app.use('/user', userRoutes)
const authRoutes = require('./routes/auth.routes')
app.use('/user', authRoutes)
const auctionRoutes = require('./routes/auction.routes')
app.use('/auction', auctionRoutes)
const bidRoutes = require('./routes/bid.routes')
app.use('/bid', bidRoutes)
const projectRoutes = require('./routes/project.routes')
app.use('/project', projectRoutes)
const standarProjectRoutes = require('./routes/standarProject.routes')
app.use('/standarProjects', standarProjectRoutes)
const companyRoutes = require('./routes/company.routes');
app.use('/api/companies', companyRoutes);


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})