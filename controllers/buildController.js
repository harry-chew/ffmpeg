const path = require('path');
const { spawn } = require('child_process');
const Settings = require('./configController');
const GlobalEvents = require('./eventController');
const config = new Settings();
const events = new GlobalEvents();

const outputFilePath = path.join(__dirname, '../../public/output/output.mp4');

const options = {
    //report: '-report',
    //safe: true,
    framerate: 25,
    filterComplex: '-filter_complex',
    fade: true
};


let args = [];

function BuildCommandPassOne(inputSources, options, outputFilePath) {
    if (!inputSources || !Array.isArray(inputSources))
        return 'Input null or not array';

    args = [];

    if(!options)
        return 'No options submitted';
    
    if (options.report)
        args.push(options.report);
    
    if (options.safe)
        args.push('-safe' , '0');
    
    if (options.framerate)
        args.push('-r', '25');

    let imageTime = 3.5;

    //this is the first and last slide... this should probably be injected in before we run this function later on 
    inputSources.splice(0, 0, '../img/logo-screen.jpg');
    inputSources.push('../img/logo-screen.jpg');

    if (!options.imageTime)
        inputSources.forEach((input) => { addInput(input); });
    else
    {
        imageTime = options.imageTime - 0.5;
        inputSources.forEach((input) => { addInput(input, true, options.imageTime)});
    }

    if (options.filterComplex)
        args.push(options.filterComplex);

    if (options.fade) {
        let fadeString;
        inputSources.forEach((input, index) => {
            if (index == 0) {
                fadeString = `[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=${imageTime}:d=1:color=white[v${index}];`;
            }
            else {
                fadeString += `[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=${imageTime}:d=1:color=white[v${index}];`;
            }
        });

        inputSources.forEach((input, index) => {
            fadeString += `[v${index}]`;
        });

        fadeString += `concat=n=${inputSources.length}:v=1:a=0,format=yuv420p[v]`

        args.push(fadeString);
    }

    args.push('-c:v', 'libx264', '-crf', '23', '-map', '[v]');

    if (outputFilePath)
        args.push('-y', outputFilePath);
    else
        args.push('-y', '../output.mp4');

    return args;
}

function RunPassOne(args) {
    const ffmpeg = spawn('ffmpeg', args, {
        cwd: __dirname,
        stdio: 'inherit'
    });

    ffmpeg.on('close', () => {
        console.log("we are completed now surely");
        events.emit('secondpass');
    });
}

function RunPassTwo(args) {
    const ffmpeg = spawn('ffmpeg', args, {
        cwd: __dirname,
        stdio: 'inherit'
    });

    ffmpeg.on('close', () => {
        console.log("pass two complete");
    });
}


function BuildCommandPassTwo(inputSources, options, outputFilePath) {
    if (!inputSources || !Array.isArray(inputSources))
        return 'Input null or not array';

    args = [];

    if(!options)
        return 'No options submitted';
    
    if (options.report)
        args.push(options.report);
    
    if (options.safe)
        args.push('-safe' , '0');
    
    if (options.framerate)
        args.push('-r', '25');

    inputSources.forEach((input, index) => { 
        let slideTime = config.settings.timings[index];
        addInput(input, true, slideTime);
    });

    if (options.filterComplex)
        args.push(options.filterComplex);

    if (options.fade) {
        let fadeString;
        inputSources.forEach((input, index) => {
            if (index == 0) {
                fadeString = `[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=${config.settings.timings[index] - 0.5}:d=1:color=white[v${index}];`;
            }
            else {
                fadeString += `[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=${config.settings.timings[index] - 0.5}:d=1:color=white[v${index}];`;
            }
        });

        inputSources.forEach((input, index) => {
            fadeString += `[v${index}]`;
        });

        fadeString += `concat=n=${inputSources.length}:v=1:a=0,format=yuv420p[v]`

        args.push(fadeString);
    }

    args.push('-c:v', 'libx264', '-crf', '23', '-map', '[v]');

    if (outputFilePath)
        args.push('-y', outputFilePath);
    else
        args.push('-y', '../overlay-output.mp4');

    return args;
}

function addInput(inputFilePath, shouldLoop = true, loopTime = 4) {
    // if (!isString(inputFilePath) || !isExtension('.jpg', inputFilePath))
    //     return false;

    if (shouldLoop && loopTime) {
        args.push('-loop', '1', '-t', loopTime, '-i', inputFilePath);
        return true;
    }
    else {
        args.push('-i', inputFilePath);
        return true;
    }
}

//HELPER METHODS
function isExtension(ext, value) {
    if (path.extname(value) == ext)
        return true;
    
    return false;
}

function isString(value) {
    return typeof value === 'string';
}

module.exports = { BuildCommandPassOne, RunPassOne, BuildCommandPassTwo, RunPassTwo };
