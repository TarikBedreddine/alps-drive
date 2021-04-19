//app
const fs = require('fs/promises');
const drive = require('./drive')
const express = require('express');

const app = express();
app.use(express.static('frontend'));

module.exports = app;


app.use('/api/drive', (req, res) => {
    drive.listFolder()
        // On récupère le module listFolder et on récupère le résultat de la promesse
        .then(function (result) {
            // On push le résultat de la requête et on l'envoie sur le navigateur
            res.send(result)
        })
        .catch(() => {
            res.status(404)
            res.send("Error")
        })
})

app.get('/api/drive/:name', (req, res) => {
    drive.displayFile().then((result) => {
        console.log(result)
    })
})

