'use strict';

import mongoose from 'mongoose';
import config from '../config.js';
import {  logError, logInfo } from '../Errores/Winston.js';

const { connect, connection } = mongoose;

mongoose.set('strictQuery', false);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDB = async () => {
  try {
    connect(config.MONGODB_ATLAS_CONNECTION_STRING, mongooseOptions);
    logInfo('Connection to MongoDB successful!');
    return true; // Signal successful connection
  } catch (err) {
    logError(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  }
};

export default connectToDB;

if (process.env.NODE_ENV !== 'production') {
  connection.on('error', (err) => logError(err));
}


// sin mongo atlas, solo mongo db
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
