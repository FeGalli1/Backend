'use strict'

import express , { json } from "express"
import swaggerUi from 'swagger-ui-express'
import YAML from "yamljs"
import cors from 'cors'
import { router } from "./routes/index.js"

const server = express()
const swaggerDocument =YAML.load('./openapi.yml')

server.use(json())
server.use(cors())
server.use('/api-doc',swaggerUi.serve, swaggerUi.setup(swaggerDocument))
server.use('/api',router)


function gracefullShutdown(message, code){
    console.log(`ERROR: ${message}: ${code}`)
}


process.on('exit', code => gracefullShutdown('about to exit whit: ', code))


export default server