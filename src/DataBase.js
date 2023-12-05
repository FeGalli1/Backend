'use strict'

import mongoose from 'mongoose'
import config from './config.js'

const { connect, connection } = mongoose

mongoose.set('strictQuery', false)

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

connect(config.MONGODB_ATLAS_CONNECTION_STRING, mongooseOptions) // Reemplazar MONGODB_ATLAS_CONNECTION_STRING con tu cadena de conexión de MongoDB Atlas
// connect(config.MONGODB_URL, mongooseOptions) // Reemplazar MONGODB con tu cadena de conexión de MongoDB offline
    .then(() => console.log('Connection has been successful!'))
    .catch(err => {
        console.log(`ERROR: in initial connection ${err}`)
        process.exit(1)
    })

if (process.env.NODE_ENV !== 'production') {
    connection.on('error', err => console.log(err))
}

// sin mongo atlas
// 'use strict'

// import mongoose from 'mongoose'
// import config from './config.js'

// const { connect, connection } = mongoose

// mongoose.set('strictQuery', false)

// const mongooseOptions = {
//     useNewUrlParser:true,
//     useUnifiedTopology: true,
// }

// connect(config.MONGODB_URL, mongooseOptions)
//     .then(()=> console.log('connection has been successfully!'))
//     .catch(
//         (err) => {console.log(`ERROR: in  initial connectio ${err}`)
//         process.on('exit')
//         })

// if (process.env.NODE_ENV !== 'production') {
//     connection.on('error', err => console.log(err))
// }
