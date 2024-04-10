const fs = require('fs');

const tempFolderPath = '../temp/';
const publicFolderPath = '../Public/';

function moveFile(fileToMove, toFilePath) {
    //if voice upload has something in it, store it in path, otherwise just use default
    if (req.files.voice != null) {
        req.files.voice.mv(req.files.voice.name);
        voiceFile = req.files.voice.name;
        voiceDefault = false;
    }
}
