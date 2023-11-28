const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const URI = process.env.URI     


const connectToBlabberDB = async ()=>{
   
    try{
        const connection = await mongoose.connect(URI,{dbName:'blabber'})
        console.log(`Connected to Blabber DB on ${connection.connection.host}`)
    }
    catch(error){
        console.log('Error connecting to the Blabber DB',error)
        process.exit(1)
    }
}

module.exports = connectToBlabberDB