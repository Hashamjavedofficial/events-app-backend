const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT =  process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/events-database',{useNewUrlParser: true, useUnifiedTopology: true}).then(res=>{
    app.listen(PORT,()=>{
        console.log('Server is up on PORT ',PORT);
    })
})