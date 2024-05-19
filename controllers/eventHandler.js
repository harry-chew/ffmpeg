const { convertAllImages } = require('../src/js/readImage');
const Settings = require('./configController');
const config = new Settings();
const path = require('path');

const GlobalEvents = require('./eventController');
const { createSVG } = require('./svgController');
const { resizeSingleImage, applyOverlay } = require('./fileController');
const { getTimingForSentence } = require('./textController');
const { BuildCommandPassOne, RunPassOne, BuildCommandPassTwo, RunPassTwo } = require('./buildController');
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
        config.settings.timings.push(getTimingForSentence(sentence));
        let svg = createSVG(sentence);
        config.settings.overlays.push(applyOverlay(svg, index));
    });
});

module.exports = events.on('resize', (images) => {
    if (!images || !Array.isArray(images))
        return;

    images.forEach((image, index) => {
        let fullFilePath = path.join(__dirname, `../public/${images[index]}`);
        config.settings.resized.push(resizeSingleImage(fullFilePath));
    });
});

module.exports = events.on('timing', () => {
    let sum = 0;
    config.settings.timings.forEach((time) => {
        sum += time;
    });

    let imageCount = config.settings.images.length;

    let timePerSlide = sum / imageCount;
    config.set('imageTime', timePerSlide);
}); 

module.exports = events.on('firstpass', () => {
    const options = {
        //report: '-report',
        //safe: true,
        framerate: 25,
        filterComplex: '-filter_complex',
        fade: true,
        imageTime : config.get('imageTime')
    };

    const outputFilePath = path.join(__dirname, '../public/output/output.mp4');

    let buildCommand = BuildCommandPassOne(config.settings.resized, options, outputFilePath);
    console.log("Starting pass 1 video compilation.");
    RunPassOne(buildCommand);
});

module.exports = events.on('secondpass', () => {
    const options = {
        //report: '-report',
        //safe: true,
        framerate: 25,
        filterComplex: '-filter_complex',
        fade: true,
        imageTime : config.get('imageTime')
    };

    const outputFilePath = path.join(__dirname, '../public/output/overlay-output.mp4');
    let buildCommand = BuildCommandPassTwo(config.settings.overlays, options, outputFilePath);
    console.log(buildCommand);
    console.log("Starting pass 2 video compilation.");
    RunPassTwo(buildCommand);
});
