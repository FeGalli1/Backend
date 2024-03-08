// import dotenv from 'dotenv'

// if (process.env.NODE_ENV !== 'production') {
//     dotenv.config()
// }

// const config = {
//     PORT: process.env.PORT,
//     MONGODB_URL: process.env.MONGODB_URL,
//     MONGODB_ATLAS_CONNECTION_STRING: process.env.MONGODB_ATLAS_CONNECTION_STRING,
//     COOKIEKEY:process.env.COOKIEKEY,
//     ID_CLIENT: process.env.ID_CLIENT,
//     CLIENT_SECRET: process.env.CLIENT_SECRET,
//     CALLBACKURL: process.env.CALLBACKURL,
// }

// export default config

import dotenv from 'dotenv'

dotenv.config('./env') // Cargar las variables de entorno del archivo correspondiente
const node_Env = process.env.NODE_ENV_CODER
let envFile
if (node_Env === 'production') {
    envFile = '.env.production' // Si estamos en producción, cargamos el archivo .env.production
} else if (node_Env === 'development') {
    envFile = '.env.development' // Si estamos en desarrollo, cargamos el archivo .env.development
}
dotenv.config({ path: envFile }) // Cargar las variables de entorno del archivo correspondiente

const config = {
    NODE_ENV: node_Env,
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    MONGODB_ATLAS_CONNECTION_STRING: process.env.MONGODB_ATLAS_CONNECTION_STRING,
    COOKIEKEY: process.env.COOKIEKEY,
    ID_CLIENT: process.env.ID_CLIENT,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACKURL: process.env.CALLBACKURL,
    MONGO_URL_SOLO: process.env.MONGO_URL_SOLO,
}

export default config
