const mongoose = require('mongoose')
const {Schema} = mongoose

const athleteSchema = new Schema({
    name:{
        type:String
    },
    underInvestigation:{
        type:Boolean
    },
    sport:{
        type:String
    },
    country:{
        type:String
    }
})

const Athlete = mongoose.model('Athlete',athleteSchema)

module.exports = Athlete