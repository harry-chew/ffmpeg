const sharp = require('sharp');
const path = require('path');

async function resizeAllImages(images) {
    if (!images || !Array.isArray(images))
        return;

}

async function resizeOneImage(fullFilePath) {
    if (!fullFilePath)
        return;

    let split = fullFilePath.split('\\');
    let localPath = split[split.length - 1];
    let outputPath = path.join(__dirname, `../public/resized/${localPath}`);

    let promise = new Promise((resolve, reject) => {
        sharp(fullFilePath)
        .resize({
              width: 1920,
              height: 1080,
              fit: sharp.fit.cover,
              position: sharp.strategy.attention
        })
        .toFile(outputPath, (err, info) => {
          if (err) {
            console.error(err);
            return reject(err);
          } else {
            console.log(info);
            return resolve(outputPath);
          }
        });
    });
}

const someOutcomeFromPromise = async () => {
    let some = await resizeOneImage(path.join(__dirname, '../public/img/image_0.jpg'));
    return some;
};

console.log(someOutcomeFromPromise());

function resizeSingleImage(fullFilePath) {

    let paths = fullFilePath.split('\\');
    let finalPath = paths[paths.length - 1];

    let outputPath = path.join(__dirname, `../../public/resized/resized_${finalPath}`);
    const doit = sharp(fullFilePath)
    .resize({
          width: 1920,
          height: 1080,
          fit: sharp.fit.cover,
          position: sharp.strategy.attention
    })
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        //console.log(info);
      }
    });
    return outputPath;
  }

  module.exports = { resizeOneImage };