const express=require('express')
const connectDB=require('./config/db')
const cors=require('cors')

const app=express()
const port=8080

app.use(cors())
app.use(express.json())

connectDB();

//Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})