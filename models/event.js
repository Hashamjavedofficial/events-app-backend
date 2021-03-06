const mongoose = require('mongoose')
const {Schema} = mongoose

const eventSchema = new Schema({
    sport:{
        type:String
    },
    eventDate:{
        type:Date
    },
    address:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    eventImage: {
        type: Buffer,
    },
    athletes:[
        {type:Schema.Types.ObjectId,
        ref:'Athlete'
    }
    ],
    result:{
        type:String,
    }
})

const Event = mongoose.model('Event',eventSchema)
module.exports = Event;