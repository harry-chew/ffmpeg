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

function createOverlay(imagePath, text) {
  let splitPath = imagePath.split('\\');
  let last = splitPath[splitPath.length-1];
  let droppedArray = splitPath.slice(0, splitPath.length-2);
  droppedArray.push('overlays');
  let newPath = droppedArray.join('/');
  let overlay = `overlay-${last}`;
  let realPath = path.join(newPath, overlay);

  let svg = addTextToSVG(text);

  const output = sharp(imagePath, { animated: false })
  .resize(
    { 
      width: 1920,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    })
  .composite([
    { 
        input: pathToFile,
        blend: 'over',
        top : 0,
        left : 0
      }
  ])
  .toFile(realPath, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
      //addText(inputFilePath, text);
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
        console.log(info);
        //addText(inputFilePath, text);
      }
    });
}

function addText(i, text) {
  const output = sharp(`overlay-${i}`, { animated: false })
    .extract({ left: 0, top: 0, width: 1920, height: 1080 })
    .composite([
      { 
          input: Buffer.from(addTextToSVG(text)),
          blend: 'over',
          position: sharp.strategy.attention,
          top: 0,
          left : 0
        }
    ])

    .toFile(`./temp/ot${i}.jpg`, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
}

function resizeImage(image) {
  return sharp(image).resize({
        width: 1920,
        height: 1080,
        fit: 'outside',
        position: sharp.strategy.attention
  })
  .toFile(`./resized/${image}`, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
}

module.exports = { addOverlay, resizeImage, addTextToSVG, createOverlay }
// for(let i = 0; i < 5; i++) {
//     addOverlayTwo(i);
// }
//addOverlayTwo(1, "Some text goes here");
//addOverlay();



