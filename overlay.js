const sharp = require('sharp');
const path = require('path');


const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
                <text x="50" y="1030" font-family="Verdana" font-size="40" fill="black">
                This is some poem text will go and then you will be able to read it in the time that the slide is on.
                </text>
             </svg>`;

const pathToFile = path.join(__dirname, 'overlay.png');
function addOverlay() {
    const output =  sharp('./img/1.jpg', { animated: false })
      .resize({ width: 1920, height : 1080 })
      .composite([
        { 
            input: pathToFile,
            blend: 'over',
            top : 0,
            left : 0
          }
      ])
      .toFile('withoverlay.jpg', (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log(info);
          addText();
        }
      });
}
function addText() {
    const output =  sharp('withoverlay.jpg', { animated: false })
      .composite([
        { 
            input: Buffer.from(svg),
            blend: 'over',
            top: 0,
            left :0
          }
      ])
      .toFile('withoverlayandtext.jpg', (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log(info);
        }
      });
}

function addOverlayTwo(i) {
  const output =  sharp('./img/1.jpg', { animated: false })
    .resize({ width: 1920})
    .composite([
      { 
          input: pathToFile,
          blend: 'over',
          top : 0,
          left : parseInt(`${i}0`)
        }
    ])
    .toFile(`${i}.jpg`, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
        addTextTwo(i);
      }
    });
}
function addTextTwo(i) {
  const output =  sharp(`${i}.jpg`, { animated: false })
    .composite([
      { 
          input: Buffer.from(svg),
          blend: 'over',
          top: parseInt(`${i}0`),
          left : parseInt(`${i}0`)
        }
    ])
    .toFile(`${i}ot.jpg`, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
}

for(let i = 0; i < 5; i++) {
    addOverlayTwo(i);
}
  
//addOverlay();



