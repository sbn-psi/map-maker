
import dotenv from 'dotenv'

// env setup
if(!process.env.MINIO_ACCESS_KEY) {
    console.log('using local .env file')
    dotenv.config({ path: '.env' })
}