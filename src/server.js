'use strict'

import express , { json } from "express"
import swaggerUi from 'swagger-ui-express'
import YAML from "yamljs"
import cors from 'cors'
import { useNavigate } from "react-router-dom"

const server = express()
const swaggerDocument =YAML.load('./openapi.yml')

server.use(json())
server.use(cors())

server.use('/api-doc',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

function gracefullShutdown(message, code){
    console.log(`ERROR: ${message}: ${code}`)
}
process.on('exit', code => gracefullShutdown('about to exit whit: ', code))


export default server