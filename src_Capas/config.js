import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const config = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    MONGODB_ATLAS_CONNECTION_STRING: process.env.MONGODB_ATLAS_CONNECTION_STRING,
    COOKIEKEY:process.env.COOKIEKEY,
    ID_CLIENT: process.env.ID_CLIENT,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACKURL: process.env.CALLBACKURL,
}

export default config
