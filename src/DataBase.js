'use strict'

import mongoose from 'mongoose'
import config from './config.js'


const { connect, connection } = mongoose

mongoose.set('strictQuery', false)


const mongooseOptions = {
    useNewUrlParser:true,
    useUnifiedTopology: true,
}

connect(config.MONGODB_URL, mongooseOptions)
    .then(()=> console.log('connection has been successfully!'))
    .catch(
        (err) => {console.log(`ERROR: in  initial connectio ${err}`)
        process.on('exit')
        })

if (process.env.NODE_ENV !== 'production') {
    connection.on('error', err => console.log(err))
}