const mongoose=require('mongoose')
require('dotenv').config()

const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.URL)
        console.log("MongoDB connected")
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}

module.exports=connectDB;