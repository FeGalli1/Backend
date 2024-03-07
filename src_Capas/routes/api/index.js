import { readdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { removeExtensionFilename } from '../../Controles/utils/helpers.js'
import { Router } from 'express'
import { logError } from '../../Errores/Winston.js'

import { fileURLToPath } from 'url'
const router = Router()

// Función para cargar dinámicamente las rutas
async function loadRoutes(directoryPath) {
    const filenames = readdirSync(directoryPath)

    for (const filename of filenames) {
        const routerFilename = removeExtensionFilename(filename)

        if (routerFilename !== 'index') {
            try {
                const routerModule = await import(`./${routerFilename}.js`)

                if (routerModule.router) {
                    router.use(`/${routerFilename}`, routerModule.router)
                } else {
                    logError(`${routerFilename} does not export a router.`)
                }
            } catch (error) {
                logError(`Error loading ${routerFilename}: `, error)
            }
        }
    }
}

const __filename = fileURLToPath(import.meta.url)
const PATH_ROUTES = dirname(__filename)
loadRoutes(PATH_ROUTES)

export { router }
