const sharp = require('sharp');
const path = require('path');

const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
                <text x="50" y="1030" font-family="Verdana" font-size="40" fill="black">
                This is some poem text will go and then you will be able to read it in the time that the slide is on.
                </text>
             </svg>`;


function addTextToSVG(text) {
  let svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="1030" font-family="Verdana" font-size="35" fill="black">
        ${text}
      </text>
    </svg>`;

  return svg;
}
const pathToFile = path.join(__dirname, '../../img/overlay.png');

function createOverlay(pathToFile, text, index) {
  let outputPath = path.join(__dirname, `../../public/overlays/overlay-image${index}.png`);
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
          top: 920,
          left : 0
        }
    ])
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
}

function addOverlay(inputFilePath, text) {
  console.log(inputFilePath, text);
  const output = sharp(`${inputFilePath}`, { animated: false })
    .resize(
      { 
        width: 1920,
        fit: 'outside',
        position: sharp.strategy.attention,
      })
    .composite([
      { 
          input: pathToFile,
          blend: 'over',
          top : 0,
          left : 0
        }
    ])
    .toFile(`overlay-${inputFilePath}`, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        //console.log(info);
        //addText(inputFilePath, text);
      }
    });
}



function resizeImage(image, index) {
  let outputPath = path.join(__dirname, `../../public/resized/image_${index}.png`);
  const doit = sharp(image)
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

module.exports = { addOverlay, resizeImage, addTextToSVG, createOverlay }
// for(let i = 0; i < 5; i++) {
//     addOverlayTwo(i);
// }
//addOverlayTwo(1, "Some text goes here");
//addOverlay();



