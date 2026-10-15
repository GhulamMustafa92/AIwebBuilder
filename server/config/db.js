import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const connectDB = async () => {
   try{
     await mongoose.connect(process.env.MONGODB_URL, {
       serverSelectionTimeoutMS: 10000,
     })
     console.log('mongodb connected')
   }
   catch(err){
    console.log('mongodb not connect',err)
    throw err
   }
}
export default connectDB;
