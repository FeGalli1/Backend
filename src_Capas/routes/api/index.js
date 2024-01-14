import { readdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { removeExtensionFilename } from '../../Controles/utils/helpers.js'
import { Router } from 'express'

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
                    console.error(`${routerFilename} does not export a router.`)
                }
            })
            .catch(error => {
                console.error(`Error loading ${routerFilename}:`)
                console.error(error)
            })
    }
})

export { router }
