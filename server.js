//app
const drive = require('./drive')
const express = require('express');
const bb = require('express-busboy')

const app = express();
app.use(express.static('frontend'));

bb.extend(app, {
    upload: true,
    path: 'C:/Users/Tarik/AppData/Local/Temp'
});

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


app.post("/api/drive", (req, res) => {
    const regex = /^[a-zA-Z0-9-]*$/g;
    const name = req.query.name
    console.log(name)
    const regexForName = regex.test(name)
    if (regexForName) {
        drive.createFolder(name).then((result) => {
            res.send(result)
        }).catch(() => {
            res.sendStatus(404)
        })
    } else {
        res.sendStatus(400)
    }
})

app.post("/api/drive/:folder/:name?", (req, res) => {
    const folder = req.params.folder
    const name = req.query.name
    drive.createFolderInsideFolder(folder, name).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log("je passe par la")
        console.log(err)
    })
})

app.delete("/api/drive/:name", (req, res) => {
    const name = req.params.name
    drive.deleteFileOrFolder(name).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

app.delete("/api/drive/:folder/:name?", (req, res) => {
    const folder = req.params.folder
    const name = req.params.name
    console.log(folder, name)
    drive.deleteFileOrFolder(name, folder).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

app.put("/api/drive", (req, res) => {

    const fileName = req.files.file.filename
    const pathBB = req.files.file.file

    drive.uploadFile(pathBB, fileName).then((result) => {
        res.send(result)
    })
})


module.exports = app;
