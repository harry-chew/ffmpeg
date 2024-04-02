const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');



//ffmpeg commands
//-safe 0                           -> allowed to use text file to make it
//-r 1                              -> 1 fps
//-f concat                         -> concatenate all files within the text file
//-i video.txt                      -> the text file to be used as the input
//-vf pad=ceil(iw/2)*2:ceil(ih/2)*2 -> make sure each frame is eeach size and add padding either width or height to compensate
//-vcodec mpgeg4                    -> video codec to use
//-y output.mp4                     -> -y means overwrite and path to file for output
const moviePath = path.join(__dirname, 'output.mp4');
const ffmpegProcess = spawn('ffmpeg', [
    //'-report',
    //'-safe', '0',
    '-r', '25',
    '-filter_complex', `scale=8000x4000, zoompan=z='min(zoom+0.0015,1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=25:s=hd1080`,
    '-f', 'concat',
    '-i', 'video.txt',
    '-shortest',
    '-pix_fmt', 'yuvj420p',
    '-vcodec', 'mpeg4',
    '-y', moviePath
], {
    cwd: __dirname,
    stdio: 'inherit'
});