const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const {databaseConnectionString} = require('./helpers/constants')

const userRouter = require('./routes/user');
const eventRouter = require('./routes/event')
const athleteRouter = require('./routes/athlete')

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/users',userRouter);
app.use('/events',eventRouter)
app.use('/athlete',athleteRouter)

const PORT =  process.env.PORT || 5000;


mongoose.connect(databaseConnectionString,{useNewUrlParser: true, useUnifiedTopology: true}).then(res=>{
    app.listen(PORT,()=>{
        console.log('Server is up on PORT ',PORT);
    })
})