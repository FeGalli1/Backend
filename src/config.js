import dotenv from 'dotenv'

if(process.env.NODE_ENV !== 'production'){
    dotenv.config()
}

const config = {
    PORT:process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
}

export default config