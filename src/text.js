const overlay = require('./overlay');
const ffprobe = require('ffprobe-static');
const { execFile } = require('child_process');
const path = require('path');
const sharp = require('sharp');

// Path to your audio file
const audioFilePath = path.join(__dirname, '/audio/voice-over.mp3');
let audioFileLength = 0;

function getAudioDuration(audioFilePath) {
    return new Promise((resolve, reject) => {
        // Run ffprobe command to get audio metadata
        execFile(ffprobe.path, [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            audioFilePath
        ], (error, stdout, stderr) => {
            if (error) {
                reject(`ffprobe execution error: ${error}`);
                return;
            }

            // Extracted duration in seconds
            const durationSeconds = parseFloat(stdout);

            // Resolve with the duration in seconds
            resolve(durationSeconds);
        });
    });
}

let input = `In a world of twists and turns, a tale unfolds,
A journey of a heart, a story yet untold.
At four, you found a home, a family so true,
In the arms of love, where skies turned from gray to blue.`;

let index = 0;

const words = input.split(/\s+|[,.-]/);
const sentences = input.split('.');

function getWordCount(text) {
    return text.split(/\s+|[,.-]/).length;
}
function getSentenceCount(text) {
    return text.split('.').length;
}

function getNextSentence() {
    let sentence = sentences[index];
    index++;
    return sentence;
}

function getWordsInSentence(sentence) {
    return sentence.split(/\s+|[,.-]/);
}

console.log("Words:", getWordCount(input));
console.log("Sentences:", getSentenceCount(input));
getAudioDuration(audioFilePath)
    .then(duration => {
        console.log('Duration:', duration);
    })
    .catch(error => {
        console.error('Error:', error);
    });



overlay.addOverlay(1, getNextSentence());
overlay.addOverlay(2, getNextSentence());
