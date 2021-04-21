//app
const fs = require('fs/promises');
const drive = require('./drive')
const express = require('express');

// Permet de réutiliser la fonction listFolder
const path = require('path');
const os = require('os');
const alpsDriveRoot = path.join(os.tmpdir(), "api", "drive");

const app = express();
app.use(express.static('frontend'));

module.exports = app;


app.get('/api/drive', (req, res) => {
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
    const name = req.params.name
    drive.displayFile(name).then((result) => {
        res.send(result)
    }).catch(() => {
        res.status(404)
    })
})

