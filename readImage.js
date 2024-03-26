const sharp = require("sharp");

async function getMetaData(image) {
    try {
        const metadata = await sharp(image).metadata();
        return metadata;
    } catch (error) {
        return error;
    }
}

function isJpeg(input) {
    try {
        const result = input == "jpeg" ? true : false;
        return result;
    } catch (error) {
        return error;
    }
}

async function addOverlay(image) {
const output = await sharp(image, { animated: false })
  .composite([
    { input: './img/overlay.png', tile: true, blend: 'saturate' }
  ])
  .toBuffer();

  return output;
}



async function convertToJpeg(image, file) {
    try {
        const convert = await sharp(image).toFile(`image_${file}.jpg`);
        return convert;
    } catch (error) {
        return error;
    }
}

function convertAllImages(images, imagePaths) {
    images.forEach((image, index) => {
        const meta = getMetaData(image.data);
        if (!isJpeg(meta)) {
            convertToJpeg(image.data, index);
        }
        else {
            sharp(image.data).toFile(`image_${index}.jpg`);
        }
        imagePaths.push(`image_${index}.jpg`);
    });
}

module.exports = { getMetaData, isJpeg, convertToJpeg, convertAllImages, addOverlay }