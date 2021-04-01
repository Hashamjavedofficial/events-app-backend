const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const moment = require('moment')
const router = express.Router()
const Athlete =require('../models/athlete')

const {bufferToImage} = require('../helpers/helperFunctions')

const auth = require('../middlewares/authentication')

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

router.post('/create',auth,upload.single('athleteImage'),async (req,res,next)=>{
    try{
        let buffer=null;
        if(req.file){
            buffer = await sharp(req.file.buffer)
                .png()
                .resize({ width: 250, height: 250 })
                .toBuffer();
        }
        const athlete = new Athlete({
            name:req.body.name,
            underInvestigation:req.body.underInvestigation,
            sport:req.body.sport,
            country:req.body.country,
            athleteImage:buffer
        });
        const savedAthlete= await athlete.save();
        res.status(201).json({message:'Athlete created successfully',data:savedAthlete})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})

router.put('/update',auth,upload.single('athleteImage'),async (req,res,next)=>{
    try{
        let buffer=null;
        if(req.file){
            buffer = await sharp(req.file.buffer)
                .png()
                .resize({ width: 250, height: 250 })
                .toBuffer();
        }
        const savedAthlete = await Athlete.findOneAndUpdate({_id:req.body._id},{
            name:req.body.name,
            underInvestigation:req.body.underInvestigation,
            sport:req.body.sport,
            country:req.body.country,
            athleteImage:buffer
        })

        res.status(201).json({message:'Athlete updated successfully',data:savedAthlete})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})

router.get('/',auth,async (req,res)=>{
    try{
        const athletes = await Athlete.find({})
        if(!athletes){
            throw new Error('No athletes found')
        }
        res.status(200).json({message:"Success",data:athletes})
    }catch(e){
        res.status(500).send({message:e.message})
    }
})

router.get('/:id',auth,async (req,res)=>{
    try{
        const {id} = req.params;
        const athlete = await Athlete.findById(id);
        if(!athlete){
            res.status(404).json({message:'Athlete Not found'})
        }
        res.status(200).json({message:'Success',data:athlete})
    }catch(e){
        res.status(500).json({message:e.message})
    }
})

router.post('/search',auth,async(req,res)=>{
    try{
        const athletes = await Athlete.find({$or:[{country:req.body.country},{sport:req.body.sport}]})
        res.status(200).json({message:'Found Athletes',data:athletes})
    }catch (e) {
        res.status(500).json({message:e.message})
    }
})

router.delete('/:id',auth,async(req,res)=>{
    try{
        const athlete = await Athlete.deleteOne({_id:req.params.id});
        res.status(200).json({message:'Athlete Deleted',data:athlete})
    }catch (e) {
        res.status(200).json({message:e.message})
    }
})

module.exports = router