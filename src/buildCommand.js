const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const outputFilePath = path.join(__dirname, 'output.mp4');

const options = {
    //report: '-report',
    //safe: true,
    framerate: 25,
    filterComplex: '-filter_complex',
    fade: true
};

let inputs = [
    '../temp/ot1.jpg',
    '../temp/ot2.jpg'
];

let args = [

];

function BuildCommand(inputSources, options, outputFilePath) {
    if(!options)
        return 'No options submitted';

    if (options.report)
        args.push(options.report);
    
    if (options.safe)
        args.push('-safe' , '0');
    
    if (options.framerate)
        args.push('-r', '25');

    inputSources.forEach((input) => { addInput(input); });

    if (options.filterComplex)
        args.push(options.filterComplex);

    if (options.fade) {
        let fadeString;
        inputSources.forEach((input, index) => {
            if (index == 0) {
                fadeString = `[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=3.5:d=1:color=white[v${index}];`;
            }
            else {
                fadeString += `[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=3.5:d=1:color=white[v${index}];`;
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
}

BuildCommand(inputs, options, outputFilePath);

console.log(args);

const ffmpegProcess = spawn('ffmpeg', args, {
    cwd: __dirname,
    stdio: 'inherit'
});


function addInput(inputFilePath, shouldLoop = true, loopTime = 4) {
    if (!isString(inputFilePath) || !isExtension('.jpg', inputFilePath))
        return false;

    if (shouldLoop && loopTime) {
        args.push('-loop', '1', '-t', loopTime, '-i', inputFilePath);
        return true;
    }
    else {
        args.push('-i', inputFilePath);
        return true;
    }
}






function isExtension(ext, value) {
    if (path.extname(value) == ext)
        return true;
    
    return false;
}

function isString(value) {
    return typeof value === 'string';
}