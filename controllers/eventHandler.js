const { addOverlay, createOverlay, resizeImage } = require('../src/js/overlay');
const { convertAllImages } = require('../src/js/readImage');
const Settings = require('./configController');
const config = new Settings();
const path = require('path');

const GlobalEvents = require('./eventController');
const { createSVG } = require('./svgController');
const { resizeSingleImage, applyOverlay } = require('./fileController');
const events = new GlobalEvents();

module.exports = events.on('poem', (text) => {
    if (!text)
        return;

    config.set('sentences', getSentences(cleanInput(text)));
});

module.exports = events.on('images', (images) => {
    if (!images || !Array.isArray(images))
        return;

    //convert to jpg
    const imagePaths = [];
    convertAllImages(images, imagePaths);
    //add new filepath to config
    config.set('images', imagePaths);
});

module.exports = events.on('overlay', (sentences) => {
    if (!sentences || !Array.isArray(sentences))
        return;

    sentences.forEach((sentence, index) => {
        let svg = createSVG(sentence);
        applyOverlay(svg, index);
    });
});

module.exports = events.on('resize', (images) => {
    if (!images || !Array.isArray(images))
        return;

    images.forEach((image, index) => {
        let fullFilePath = path.join(__dirname, `../public/${images[index]}`);
        resizeSingleImage(fullFilePath);
    })
});