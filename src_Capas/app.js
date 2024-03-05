'use strict'

import config from './config.js'
import { logError } from './Errores/Winston.js'
import connectToDB from './Persistencia/DataBase.js'
import createServer from './routes/server.js'

// Wait for database connection before starting server
const PORT = config.PORT || 8080

async function startServer() {
    try {
        await import('./Persistencia/DataBase.js') // Importa y espera la conexión
        const connected = await connectToDB() // Llama a la función de conexión y verifica el resultado
        if (connected) {
            const httpServer = createServer()
            httpServer.listen(PORT, () => console.log(`El servidor está listo en http://localhost:${PORT}`))
        }
    } catch (err) {
        logError(err)
        process.exit(1)
    }
}

startServer() // Ejecuta la función de inicio del servidor
