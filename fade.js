const express = require('express');
const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;




const moviePath = 'output.mp4';
const ffmpegProcess = spawn('ffmpeg', [
    //'-i', 'concat:image%d.jpg',
    '-i', 'concat:fileList.txt',
    //'-filter_complex', '[0]fade=d=1:alpha=1,setpts=PTS-STARTPTS+0/TB[fade0];[1]fade=d=1:alpha=1,setpts=PTS-STARTPTS+1/TB[fade1];',
    '-vf', `pad=ceil(iw/2)*2:ceil(ih/2)*2,zoompan=d=3:fps=2,framerate=25:interp_start=0:interp_end=255:scene=100`,
    '-pix_fmt', 'yuv420p',
    '-vcodec', 'libx264',
    '-movflags', '+faststart',
    '-y', 'output.mp4'
], {
    cwd: __dirname,
    stdio: 'inherit'
});

// ffmpegProcess.on('close', () => {
//     // Delete temporary image files
//     imagePaths.forEach(fs.unlinkSync);
//     // Send the movie file as a response
//     res.download(moviePath, () => {
//         // Delete the movie file after sending
//         fs.unlinkSync(moviePath);
//     });
// });