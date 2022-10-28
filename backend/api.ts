import express from 'express'
const router = express.Router()
import db from './db.js'
import { adaptInputToModel } from './adapters.js'
import { Zone } from './model.js'

router.post('/zones', (req, res) => {
    let zones: Zone[] = []
    try {
        zones = adaptInputToModel(req.body).zones
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
        return
    }

    db.transaction(trx => {
        return trx('zones').insert(zones)
            .then(() => {
                res.status(200).send('ok')
            }, e => {
                console.log(e)
                res.status(500).send(e)
            })
    })
})

router.get('/samples', (req, res) => {
    db.select('*').from('samples').then(data => {
        res.send(data)
    })
})
router.get('/zones', (req, res) => {

    db.select('*').from('zones').then(data => {
        res.send(data)
    })
})

export default router