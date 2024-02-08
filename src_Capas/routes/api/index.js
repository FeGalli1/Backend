import { readdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { removeExtensionFilename } from '../../Controles/utils/helpers.js'
import { Router } from 'express'
import { logError } from '../../Errores/Winston.js'

const router = Router()
const PATH_ROUTES = dirname(`${import.meta.url}`).split('file:///')[1]

readdirSync(PATH_ROUTES).filter(filename => {
    const routerFilename = removeExtensionFilename(filename)

    if (routerFilename !== 'index') {
        import(`./${routerFilename}.js`)
            .then(routerModule => {
                if (routerModule.router) {
                    router.use(`/${routerFilename}`, routerModule.router)
                } else {
                    logError(`${routerFilename} does not export a router.`)
                }
            })
            .catch(error => {
                logError(`Error loading ${routerFilename}: `,error)
            })
    }
})

export { router }
