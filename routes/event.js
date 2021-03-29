const express = require('express')
const router = express.Router()
const Event =require('../models/event')

const auth = require('../middlewares/authentication')

router.post('/create',auth,async (req,res,next)=>{
    try{
        const event = new Event({
            sport:req.body.sport,
            eventDate:req.body.eventDate,
            status:req.body.status,
            description:req.body.description
        });
        const savedEvent = await event.save();
        res.status(201).json({message:'Event created successfully',data:savedEvent})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})

router.get('/',async (req,res)=>{
    try{
        const events = await Event.find({})
        if(!events){
            throw new Error('No events found')
        }
        res.status(200).json({message:"Success",data:events})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})

router.get('/:id',async (req,res)=>{
    try{
        const {id} = req.params;
        const event = await Event.findById(id);
        if(!event){
            res.status(404).json({message:'Event Not found'})
        }
        res.status(200).json({message:'Success',data:event})
    }catch(e){
        res.status(500).json({message:e.message})
    }
})

module.exports = router