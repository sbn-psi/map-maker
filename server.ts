import express from 'express'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import './envsetup.js'

// express, minio setup
console.log('connecting to file server...')
import bootstrap from './backend/minio.js'
bootstrap().then(expressSetup, error => {
    console.log("############# ERROR #################")
    console.log("##### Couldn't connect to Minio #####")
    console.log(error)
    console.log("###### Starting server anyway #######")
    startServer()
});

const app = express()
app.use(express.static('client/build'))
app.use(express.json({ limit: '3MB' }))
app.use(fileUpload())
app.use(helmet())

// called once file server is bootstrapped; starts the actual listening process
function expressSetup(minioHandler: any) {
    app.use('/image/upload', minioHandler)
    startServer()
}

import api from './backend/api.js'
app.use('/api', api)

function startServer() {
    app.listen(8686, () => {
        console.log(`running on port 8686...`)
    })
}

