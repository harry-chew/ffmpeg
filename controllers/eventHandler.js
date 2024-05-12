const { addOverlay, createOverlay } = require('../src/js/overlay');
const { convertAllImages } = require('../src/js/readImage');
const Settings = require('./configController');
const config = new Settings();
const path = require('path');

const GlobalEvents = require('./eventController');
const events = new GlobalEvents();

module.exports = events.on('poem', (text) => {
    if (!text)
        return;

    //config.set('poemClean', cleanInput(text));
    config.set('sentences', getSentences(cleanInput(text)));
});

module.exports = events.on('images', (images) => {
    if (!images)
        return;

    if (Array.isArray(images))
    {
        //convert to jpg
        const imagePaths = [];
        convertAllImages(images, imagePaths);
        //add new filepath to config
        config.set('images', imagePaths);
    }
});

module.exports = events.on('overlay', (sentences) => {
    if (!sentences)
        return;

    const overlayPath = path.join(__dirname, '../img/overlay.png');
    if (Array.isArray(sentences))
    {
        let imagePath = path.join(__dirname, `../public/${config.settings.images[0]}`);
        createOverlay(imagePath, "text");
    }
});