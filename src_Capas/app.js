'use strict'

// import server from './server.js';
import config from './config.js'
import { logError } from './Errores/Winston.js'
import connectToDB from './Persistencia/DataBase.js'
// Wait for database connection before starting server
const PORT = config.PORT || 8080
async function startServer() {
    try {
        await import('./Persistencia/DataBase.js') // Import and wait for connection
        const connected = await connectToDB() // Call connection function and check result
        if (connected) {
            try {
                const serverModulePath = new URL('/src_Capas/routes/server.js', import.meta.url).pathname
                const { default: server } = await import(serverModulePath)
                server.listen(PORT, () => console.log('el server esta listo en  http://localhost:' + config.PORT))
            } catch (err) {
                logError('Error starting server:' + err)
                process.exit(1)
            }
        }
    } catch (err) {
        logError(err)
        process.exit(1)
    }
}

startServer() // Run the server start function
