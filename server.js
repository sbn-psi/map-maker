// internal modules
const db = require('./db.js')

// env setup
if(!process.env.MINIO_ACCESS_KEY) {
    console.log('using local .env file')
    require('dotenv').config({ path: '.env' })
}

// express, minio setup
console.log('connecting to file server...')
require('./minio.js').bootstrap().then(expressSetup, error => {
    console.log("############# ERROR #################")
    console.log("##### Couldn't connect to Minio #####")
    console.log(error)
    console.log("###### Starting server anyway #######")
    startServer()
});
const express = require('express')
const app = express()
app.use(express.json({ limit: '10MB' }))
const helmet = require('helmet')
app.use(helmet())

// called once file server is bootstrapped; starts the actual listening process
function expressSetup(minioHandler) {
    app.use('/image/upload', minioHandler)
    startServer()
}

function startServer() {
    app.listen(process.env.PORT, () => {
        console.log(`running on port ${process.env.PORT}...`)
    })
}
