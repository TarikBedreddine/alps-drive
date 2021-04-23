// REQUIRE ALL NECESSARY FILES & MODULES
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

// PATH OF MY ROOT FOLDER
const alpsDriveRoot = path.join(os.tmpdir(), "api", "drive");
console.log(alpsDriveRoot)

// CREATE AN /API/DRIVE FOLDER IN TMPDIR
function createRootFolder() {
    const promise = fs.access(alpsDriveRoot)
        .then(() => console.log("Le dossier existe déjà"))
        .catch(() => {
            return fs.mkdir(alpsDriveRoot, {recursive: true})
        })
    return promise
}

// LIST ALL FOLDERS OF THE ROOT
function listFolder(path = alpsDriveRoot) {
    // Le paramètre withFileTypes permet de retourner un tableau avec des Objets et non pas un tableau avec des Strings
    const promise = fs.readdir(path, {withFileTypes: true})
    return promise.then((results) => {
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

// DISPLAY CONTENT IF IT'S FILE OR LIST FOLDER
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

// CREATE A FOLDER AT ROOT
function createFolder(name) {
    const filePath = path.join(alpsDriveRoot, name)
    return fs.access(filePath)
        .then(() => console.log("Le dossier existe déjà :("))
        .catch(() => {
            return fs.mkdir(filePath, {recursive: true})
        })
}

// FUNCTION TO CREATE A FOLDER INSIDE AN OTHER FOLDER
function createFolderInsideFolder(folder, name) {
    const filePath = path.join(alpsDriveRoot, folder, name)
    return fs.access(filePath)
        .then(() => console.log("Le dossier existe déjà !!!"))
        .catch(() => {
            return fs.mkdir(filePath, {recursive: true})
        })
}

// FUNCTION TO DELETE FILE OR A FOLDER
function deleteFileOrFolder(name, folder = false) {
    function isItFolder(folder) {
        if (folder) {
            return path.join(alpsDriveRoot, folder, name)
        } else {
            return path.join(alpsDriveRoot, name)
        }
    }
    const correctPath = isItFolder(folder)
    return fs.access(correctPath)
        .then(() => {
            return fs.rm(correctPath, {recursive: true})
        })
        .catch(() => {
            return console.log("Erreur, le fichier ne peut pas être supprimé")
        })
}

// UPLOAD A FILE. IF ANY FOLDER IS RECEIVED THE PATH IS DIFFERENT
function uploadFile(pathBB, nameFile, folder = false) {
    function isItFolder(folder) {
        if (folder) {
            return path.join(alpsDriveRoot, folder, nameFile)
        } else {
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