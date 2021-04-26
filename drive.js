// REQUIRE ALL NECESSARY FILES & MODULES
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

// PATH OF MY ROOT FOLDER
const alpsDriveRoot = path.join(os.tmpdir(), "api", "drive");
console.log(alpsDriveRoot)

// CREATE AN /API/DRIVE FOLDER IN TMPDIR
function createRootFolder() {
    return fs.access(alpsDriveRoot)
        .then(() => console.log("Le dossier existe déjà"))
        .catch(() => {
            return fs.mkdir(alpsDriveRoot, {recursive: true})
        })
}

// LIST ALL FOLDERS OF THE ROOT
function readDirectory(pathFile = alpsDriveRoot) {
    // withFileTypes permitted to return an object array instead of string array
    const promise = fs.readdir(pathFile, {withFileTypes: true})
    return promise.then((results) => {
        const allData = [];
        // For each array object i send an object with 2 keys inside allData array
        results.forEach((oneResult) => {
            const pathJoined = path.join(pathFile, oneResult.name)
            const resultSize = fs.stat(pathJoined).then((result) => {
                console.log(result.size)
            })
            allData.push({
                name: oneResult.name,
                isFolder: oneResult.isDirectory(),
                size: resultSize
            })
        })
        console.log(allData)
        return allData;
    }).catch((err) => {
        console.log("error" + err)
    })
}

// DISPLAY CONTENT IF IT'S FILE OR LIST FOLDER
function displayFile(name) {
    const filePath = path.join(alpsDriveRoot, name)
    const statFile = fs.stat(filePath)
    return statFile.then((result) => {
            if (result.isFile()) {
                return fs.readFile(filePath)
            } else {
                return readDirectory(filePath)
            }
        }
    ).catch((err) => {console.log(err)})
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

// FUNCTIONS TO DISPLAY THE SIZE OF A FILE ++++ IN PROGRESS
function transformDirentToAlpsFile(dirent) {
    return {
        name: dirent.name,
        isFolder: true
    }
}

function transformToAlpsResults (results) {
    return results.map(result => {
        if (result.isDirectory()) {
            return transformDirentToAlpsFile(result)
        }
        return transformDirentToAlpsFile(result)
    })
}

function listFolder() {
    return readDirectory()
        .then(dirents => transformToAlpsResults(dirents))
        .then(pendingPromisesResults => Promise.all(pendingPromisesResults))
}


// Export all functions that i need
module.exports = {
    createRootFolder: createRootFolder,
    readDirectory: readDirectory,
    displayFile: displayFile,
    listFolder: listFolder,
    createFolder: createFolder,
    createFolderInsideFolder: createFolderInsideFolder,
    deleteFileOrFolder: deleteFileOrFolder,
    uploadFile: uploadFile,
};