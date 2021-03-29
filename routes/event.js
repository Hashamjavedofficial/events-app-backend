const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = express.Router()
const Event =require('../models/event')

const auth = require('../middlewares/authentication')

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpe?g|png|gif|jpeg)$/i)) {
            return cb(new Error("Not a valid file"));
        }
        cb(undefined, true);
    },
});

router.post('/create',auth,upload.single('eventImage'),async (req,res,next)=>{
    try{
        const buffer = await sharp(req.file.buffer)
        .png()
        .resize({ width: 250, height: 250 })
        .toBuffer();
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