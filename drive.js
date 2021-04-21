const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const alpsDriveRoot = path.join(os.tmpdir(), "api", "drive");
console.log(alpsDriveRoot)

function createRootFolder() {
    const promise = fs.access(alpsDriveRoot)
        .then(() => console.log("Le dossier existe déjà"))
        .catch(() => {
            return fs.mkdir(alpsDriveRoot, {recursive: true})
        })
    return promise
}

function listFolder(path = alpsDriveRoot) {
    // Le paramètre withFileTypes permet de retourner un tableau avec des Objets et non pas un tableau avec des Strings
    const promise = fs.readdir(path, {withFileTypes: true})
    // Important de faire un return à cet endroit et NON pas à la fin
    return promise.then((results) => {
        // Tableau à peupler
        const allData = [];
        // Pour chaque objet du tableau, on crée un autre objet avec 2 key (name et isDirectory)
        results.forEach((oneResult) => {
            allData.push({
                name: oneResult.name,
                isFolder: oneResult.isDirectory()
            })
        })
        return allData;
    }).catch(() => {
        console.log("error")
    })
}

function displayFile(name) {
    const filePath = path.join(alpsDriveRoot, name)
    const statFile = fs.stat(filePath)
    return statFile.then((result) => {
            if (result.isFile()) {
                return fs.readFile(filePath, "utf8")
            } else {
                return listFolder(filePath).then((result) => {
                    console.log(result)
                })
            }
        }
    )
}

module.exports = {
    createRootFolder: createRootFolder,
    listFolder: listFolder,
    displayFile: displayFile
};


/*
const promise = fs.readdir(filePath, {withFileTypes: true})
return promise.then((results) => {
    const allData = [];
    results.forEach((oneResult) => {
        allData.push({
            name: oneResult.name,
            isFolder: oneResult.isDirectory()
        })
    })
    return allData;
}).catch(() => {
    console.log("error")
})*/