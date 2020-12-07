const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/tasks')
const UserRouter=require('./routers/user')
const TaskRouter=require('./routers/task')

const app=express()
const port=process.env.PORT


app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

// const multer=require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(re,file,callback){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return callback(new Error('Please upload a Word document'))
//         }
//         callback(undefined,true)

//         // callback(new Error('File must a PDF'))
//         // callback(undefined,true)
//         // diifert ways to trigger callback fn.

//     }
// })

// const errorMiddleware=(req,res,next)=>{
//     throw new Error('from my middle ware')
// }

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })



// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send('GET requests are disabled')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('server is under mantainence')
// })

//withot middleware new request->run route handler
//with middlewre new request->do something->run route handler
//to make exress know that "do something" execution is completed we use next()



//create new router->Set up those routes->register with the xpress application


// const jwt=require('jsonwebtoken')

// const Myfunction=async()=>{
//     const token =jwt.sign({_id:'abc13'},'chiru')
//     console.log(token)
//     const data=jwt.verify(token,'chiru')
//     console.log(data)
// }

// Myfunction()

// const bcrypt=require('bcrypt')

// const myfunction=async()=>{
//     const password='red123'
//     const hashed=await bcrypt.hash(password,8)
//     const isMatch=await bcrypt.compare('red123',hashed)

//     return {password,hashed,isMatch}
//     // console.log(password)
//     // console.log(hashed)
// }

// myfunction().then((res)=>{
//     console.log(res)
// })

//hashing here is one way algorithm


// const main=async()=>{
//     // const task=await Task.findById('5fcde3466c55f6323ffca3e9')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)
//     const user=await User.findById('5fcdf369145bf338314aa172')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()