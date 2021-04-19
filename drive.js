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

function listFolder() {
    // Le paramètre withFileTypes permet de retourner un tableau avec des Objets et non pas un tableau avec des Strings
    const promise = fs.readdir(alpsDriveRoot, {withFileTypes: true})
    // Important de faire un return à cet endroit et NON pas à la fin
    return promise.then((results) => {
        // Tableau à peupler
        const allData = [];
        // Pour chaque objet du tableau, on crée un autre objet avec 2 key (name et isDirectory)
        results.forEach((oneResult) => {
            allData.push({
                name: oneResult.name,
                isDirectory: oneResult.isDirectory()
            })
        })
        return allData;
    }).catch(() => {
        console.log("error")
    })
}

function displayFile() {
    if (req.name.isDirectory) {
        console.log("dossier!!!!!!!!!!!")
    } else {
        const promise = fs.readFile(alpsDriveRoot + '/' + req.name)
        return promise
    }
}


module.exports = {
    createRootFolder: createRootFolder,
    listFolder: listFolder,
    displayFile: displayFile
};