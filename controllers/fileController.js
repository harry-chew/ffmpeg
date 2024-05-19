const sharp = require('sharp');
const path = require('path');

function resizeSingleImage(fullFilePath) {
    let paths = fullFilePath.split('\\');
    let finalPath = paths[paths.length - 1];
    let outputPath = path.join(__dirname, `../public/resized/resized_${finalPath}`);

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

function applyOverlay(text, index) {
  let pathToFile = path.join(__dirname, '../img/overlay-bg.png');
  let outputPath = path.join(__dirname, `../public/overlays/overlay-image${index}.png`);

  const output = sharp(pathToFile, { animated: false })
  .resize(
  { 
    width: 1920,
    fit: 'outside',
    position: sharp.strategy.attention,
  })
  .composite([
    { 
        input: Buffer.from(text),
        blend: 'over',
        position: sharp.strategy.attention,
        top: 800,
        left : 0
      }
  ])
  .toFile(outputPath, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      //console.log(info);
    }
  });
  
  return outputPath;
}

module.exports = { resizeSingleImage, applyOverlay };
