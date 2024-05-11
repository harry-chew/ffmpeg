const { convertAllImages } = require('../src/js/readImage');
const Settings = require('./configController');
const config = new Settings();

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

    if (Array.isArray(sentences))
    {
        console.log(sentences);
    }
});