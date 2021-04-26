// REQUIRE ALL NECESSARY FILES & MODULES
const drive = require('./drive')
const fs = require('fs/promises');
const express = require('express');
const bb = require('express-busboy')


//
const app = express();
// EXPRESS STATIC PERMIT TO SERVE STATIC FILES (WHICH ARE IN FRONTEND FOLDER)
app.use(express.static('frontend'));

//BUSBODY MODULE, PERMITTED TO UPLOAD FILES
bb.extend(app, {
    upload: true,
    path: 'C:/Users/Tarik/AppData/Local/Temp'
});

// THIS ROUTE PERMITED TO LIST ALL FOLDERS AND FILES IN ROOT
app.get('/api/drive', (req, res) => {
    drive.listFolder()
        .then(function (result) {
            res.send(result)
        })
        .catch(() => {
            res.status(404)
            res.send("Error")
        })
})

// THIS ROUTE DISPLAY THE CONTENT OF A FILE WHEN USER CLICK ON IT // "*" permit to open the file even if there is many folders before
app.get('/api/drive/*', (req, res) => {
    const name = req.params[0]

    drive.displayFile(name).then((result) => {
        res.send(result)
    }).catch(() => {
        res.status(404)
    })
})

// THIS ROUTE CREATE A FOLDER WHEN THE INPUT IS FILLED (+ REGEX SANITIZE)
app.post("/api/drive", (req, res) => {
    const regex = /^[a-zA-Z0-9-.]*$/g;
    const name = req.query.name
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

// THIS ROUTE PERMIT TO CREATE FOLDER INSIDE AN OTHER FOLDER (+ REGEX SANITIZE)
app.post("/api/drive/*/:name?", (req, res) => {
    const regex = /^[a-zA-Z0-9-.]*$/g;
    const folder = req.params[0]
    const name = req.query.name
    const regexForName = regex.test(name)
    if (regexForName) {
        drive.createFolderInsideFolder(folder, name).then((result) => {
            res.send(result)
        }).catch(() => {
            res.sendStatus(404)
        })
    } else {
        res.sendStatus(400)
    }
})

// THIS ROUTE ALLOWS USER TO DELETE A FILE OR A FOLDER
app.delete("/api/drive/:name", (req, res) => {
    const regex = /^[a-zA-Z0-9-.]*$/g;
    const name = req.params.name
    const regexForName = regex.test(name)
    if (regexForName) {
        drive.deleteFileOrFolder(name).then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err)
        })
    }else {
        res.sendStatus(400)
    }
})

// THIS ROUTE PERMIT TO DELETE A FOLDER OR A FILE WHICH IS INSIDE A FOLDER
app.delete("/api/drive/*/:name", (req, res) => {
    const regex = /^[a-zÀ-úA-Z0-9-. '’]*$/gm;
    const folder = req.params[0]
    const name = req.params.name
    const regexForName = regex.test(name)
    if (regexForName) {
        drive.deleteFileOrFolder(name, folder).then((result) => {
            res.send(result)
        }).catch(() => {
            res.sendStatus(404)
        })
    } else {
        res.sendStatus(400)
    }
})

// USER CAN A UPLOAD A FILE (TEXT, PNG, JPEG ...) THANKS TO THE LABEL "UPLOAD A NEW FILE"
app.put("/api/drive", (req, res) => {
    const fileName = req.files.file.filename
    const pathBB = req.files.file.file

    drive.uploadFile(pathBB, fileName).then((result) => {
        res.send(result)
    }).catch(() => {
        res.sendStatus(400)
    })
})

// USER CAN UPLOAD A FILE INSIDE A FOLDER
app.put("/api/drive/*", (req, res) => {
    const folder = req.params[0]
    const fileName = req.files.file.filename
    const pathBB = req.files.file.file

    console.log(fileName, folder)
    drive.uploadFile(pathBB, fileName, folder).then((result) => {
        res.send(result)
    }).catch(() => {
       res.sendStatus(400)
    })
})

// EXPORT THE EXPRESS MODULE
module.exports = app;
