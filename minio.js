module.exports = {
    bootstrap
}
const Minio = require('minio')
const { Readable } = require('stream')

let readPolicy = (bucket, directory) => `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:s3:::${bucket}"
            ]
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::${bucket}"
            ],
            "Condition": {
                "StringEquals": {
                    "s3:prefix": [
                        "${directory}"
                    ]
                }
            }
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${bucket}/${directory}*"
            ]
        }
    ]
}`

let minioClient

async function bootstrap() {
    const bucket = process.env.MINIO_BUCKET
    let config = {
        endPoint: process.env.MINIO_ENDPOINT,
        useSSL: process.env.MINIO_SECURITY === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER,
        secretKey: process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD
    }
    if(!!process.env.MINIO_PORT) {
        config.port = parseInt(process.env.MINIO_PORT)
    }
    minioClient = new Minio.Client(config)

    return new Promise((resolve, reject) => {
        let setPolicy = () => {
            let policy = readPolicy(bucket, process.env.MINIO_UPLOADS_FOLDER_NAME)
            minioClient.setBucketPolicy(process.env.MINIO_BUCKET, policy, (err) => {
                err ? reject(err) : resolve(uploadHandler)
            })
        }
        minioClient.bucketExists(bucket, function(err, exists) {
            if(err) {
                reject(err)
                return
            }

            if(!exists) {
                console.log(`bucket ${bucket} didn't exist, creating`)
                minioClient.makeBucket(bucket).then(setPolicy, reject)
            } else {
                setPolicy()
            }
            
        })
    })
}

function uploadHandler(req, res) {
    let imageBaseUrl = `${process.env.MINIO_SECURITY === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}${process.env.MINIO_PORT ? ':' + process.env.MINIO_PORT : ''}/${process.env.MINIO_BUCKET}/`

    let puts = []
    let results = []
    for (fileName of Object.keys(req.files)) {

        const file = req.files[fileName]
        const name = `${process.env.MINIO_UPLOADS_FOLDER_NAME}/${file.md5}${file.name}`
    
        puts.push(minioClient.putObject(process.env.MINIO_BUCKET, name, file.data, {'Content-Type': file.mimetype}))
        results.push({ name: fileName, url: imageBaseUrl + name })
    }
    Promise.all(puts).then(success => {
        res.send(results)
    }, err => {
        res.status(400).send(err)
    })
}