const express = require('express')
const router = express.Router()
const db = require('./db.js')


router.post('/save', (req, res) => {
    res.send('hello world')
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

module.exports = router