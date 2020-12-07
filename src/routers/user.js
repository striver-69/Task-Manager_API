const express = require('express')
const router= new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeemail,sendgoingemail}=require('../emails/account')

router.post('/users',async(req,res)=>{
    const user=new User(req.body)

    try{
        await user.save()
        sendWelcomeemail(user.email,user.name)
        const token=await user.generateOfToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
})


router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findbyCredentials(req.body.email,req.body.password)
        const token=await user.generateOfToken()
        res.send({user,token})
    }catch(e){
        console.log(e.message)
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()

        res.send()
    }catch(e){
        console.log(e.message)
        res.status(500).send()
    }
})


router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
       console.log(e.message) 
       res.status(500).send()
    }
})


router.get('/users/me',auth,async(req,res)=>{

    res.send(req.user)
})


router.get('/users/:id',async(req,res)=>{
    const _id=req.params.id

    try{
        const user=await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }

})


router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedupdate=["name","email","password","age"]
    const isvalidOperation=updates.every((property)=>{
        return allowedupdate.includes(property)
    })

    if(!isvalidOperation){
        return res.status(400).send({error:'Invalid Updates'})
    }

    try{
        const user=await User.findById(req.user._id)

        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()

        //const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendgoingemail(req.user.email,req.user.name)
        res.send(req.user)
        
    }catch(e){
        console.log(e.message)
        res.status(500).send()
    }
})


const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload an image file'))
        }
        callback(undefined,true) 
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
//error callback should have signature of this mentioned profile --->(error,req,res,next)


router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send({body:"Profile pic deleted"})
},(error,req,res,next)=>{
    res.status(400).send()
})



router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(400).send()
    }
})

module.exports=router