const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const moment = require('moment')
const mongoose = require('mongoose')
const router = express.Router()
const Event =require('../models/event')

const {bufferToImage} = require('../helpers/helperFunctions')

const auth = require('../middlewares/authentication')
const { findOneAndUpdate } = require('../models/event')

const upload = multer({
    limits: {
        fileSize: 1000000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpe?g|png|gif|jpeg)$/i)) {
            return cb(new Error("Not a valid file"));
        }
        cb(undefined, true);
    },
});

router.post('/create',upload.single('eventImage'),async (req,res,next)=>{
    try{
        let buffer=null;
        if(req.file){
            buffer = await sharp(req.file.buffer)
                .png()
                .resize({ width: 250, height: 250 })
                .toBuffer();
        }
        const event = new Event({
            sport:req.body.sport,
            eventDate:req.body.eventDate,
            address:req.body.address,
            description:req.body.description,
            title:req.body.title,
            eventImage:buffer
        });
        const savedEvent = await event.save();
        res.status(201).json({message:'Event created successfully',data:savedEvent})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})

router.put('/update',upload.single('eventImage'),async (req,res,next)=>{
    try{
        let buffer=null;
        if(req.file){
            buffer = await sharp(req.file.buffer)
                .png()
                .resize({ width: 250, height: 250 })
                .toBuffer();
        }
        const savedEvent = await Event.findOneAndUpdate({_id:req.body._id},{
            sport:req.body.sport,
            eventDate:req.body.eventDate,
            address:req.body.address,
            description:req.body.description,
            title:req.body.title,
            eventImage:buffer
        })

        res.status(201).json({message:'Event updated successfully',data:savedEvent})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})


router.post('/search',auth,async(req,res)=>{
    try{
        const today = moment(req.body.date).startOf('day')
        const events = await Event.find({$or:[{eventDate: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate()
                }},{sport:req.body.sport}]}).populate('athletes')
        res.status(200).json({message:'Found Users',data:events})
    }catch (e) {
        res.status(500).json({message:e.message})
    }
})

router.patch('/addathlete',async(req,res)=>{
    try{
        const {eventId,athleteId} = req.body
        const checkAthlete = await Event.findOne({athletes:{$in:[mongoose.Types.ObjectId(athleteId)]}})
        if(checkAthlete){
            throw new Error("Athlete already in the event")
        }
        const updatedEvent =await Event.findOneAndUpdate({_id:eventId},{
            $push:{
                athletes:{
                    _id:athleteId
                }
            }
        },{new:true,useFindAndModify:false}).populate('athletes')
res.status(200).json({message:'Athlete added',data:updatedEvent})
    }catch(e){
        res.status(500).json({message:e.message})
    }
})

router.patch('/add-result',async(req,res)=>{
    try{
        const updatedEvent = await Event.findOneAndUpdate({_id:req.body._id},{result:req.body.result},{new:true})
        if(!updatedEvent){
            throw new Error("No")
        }
        res.status(200).json({message:"Result added",data:updatedEvent})
    }catch(e){
        res.status(500).json({message:e.message})
    }
})


router.get('/',auth,async (req,res)=>{
    try{
        const events = await Event.find({}).populate('athletes').exec()
        if(!events){
            throw new Error('No events found')
        }
        res.status(200).json({message:"Success",data:events})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})

router.get('/:id',auth,async (req,res)=>{
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






router.delete('/:id',auth,async(req,res)=>{
    try{
        const event = await Event.deleteOne({_id:req.params.id});
        res.status(200).json({message:'User Deleted',data:event})
    }catch (e) {
        res.status(200).json({message:e.message})
    }
})

module.exports = router