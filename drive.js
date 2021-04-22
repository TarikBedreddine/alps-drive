const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const alpsDriveRoot = path.join(os.tmpdir(), "api", "drive");
console.log(alpsDriveRoot)

//Create an /api/drive folder in tmpdir
function createRootFolder() {
    const promise = fs.access(alpsDriveRoot)
        .then(() => console.log("Le dossier existe déjà"))
        .catch(() => {
            return fs.mkdir(alpsDriveRoot, {recursive: true})
        })
    return promise
}

// List all folders of the Root
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

//Display content if it's file or list folder
function displayFile(name) {
    const filePath = path.join(alpsDriveRoot, name)
    const statFile = fs.stat(filePath)
    return statFile.then((result) => {
            if (result.isFile()) {
                return fs.readFile(filePath, "utf8")
            } else {
                return listFolder(filePath)
            }
        }
    )
}

//Create a folder at Root
function createFolder(name) {
    const filePath = path.join(alpsDriveRoot, name)
    return fs.access(filePath)
        .then(() => console.log("Le dossier existe déjà :("))
        .catch(() => {
            return fs.mkdir(filePath, {recursive: true})
        })
}

function createFolderInsideFolder(folder, name) {
    const filePath = path.join(alpsDriveRoot, folder, name)
    return fs.access(filePath)
        .then(() => console.log("Le dossier existe déjà !!!"))
        .catch(() => {
            return fs.mkdir(filePath, {recursive: true})
        })
}

function deleteFileOrFolder(name, folder = false) {
    function isItFolder(folder) {
        if (folder) {
            return path.join(alpsDriveRoot, folder, name)
        } else {
            return path.join(alpsDriveRoot, name)
        }
    }
    const rightPath = isItFolder(folder)
    return fs.access(rightPath)
        .then(() => {
            return fs.rm(rightPath, {recursive: true})
        })
        .catch(() => {
            return console.log("Erreur, le fichier ne peut pas être supprimé")
        })
}


function uploadFile(pathBB, nameFile, folder = false) {
    function isItFolder(folder) {
        if (folder) {
            console.log("j'ai le folder" + folder)
            return path.join(alpsDriveRoot, folder, nameFile)
        } else {
            console.log("je n'ai pas le folder")
            return path.join(alpsDriveRoot, nameFile)
        }
    }
    const correctPath = isItFolder(folder)
    console.log(correctPath)
    return fs.access(pathBB)
        .then(() => {
            return fs.copyFile(pathBB, correctPath)
        })
        .catch((err) => {
            console.log(err)
        })
}


// Export all functions that i need
module.exports = {
    createRootFolder: createRootFolder,
    listFolder: listFolder,
    displayFile: displayFile,
    createFolder: createFolder,
    createFolderInsideFolder: createFolderInsideFolder,
    deleteFileOrFolder: deleteFileOrFolder,
    uploadFile: uploadFile
};