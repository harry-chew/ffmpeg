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
    //'-filter_complex', `scale=8000x4000, zoompan=z='min(zoom+0.0015,1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=25:s=hd1080`,
    '-loop', '1', '-t', '4', '-i', './temp/ot1.jpg',
    '-loop', '1', '-t', '4', '-i', './temp/ot2.jpg',
    '-loop', '1', '-t', '4', '-i', './temp/ot1.jpg',
    '-loop', '1', '-t', '4', '-i', './temp/ot2.jpg',
    '-loop', '1', '-t', '4', '-i', './temp/ot1.jpg',
    '-filter_complex',
    `[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=3.5:d=1:color=white[v0];
    [1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=3.5:d=1:color=white[v1];
    [2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=3.5:d=1:color=white[v2];
    [3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=3.5:d=1:color=white[v3];
    [4:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1,fade=t=out:st=3.5:d=1:color=white[v4];
    [v0][v1][v2][v3][v4]concat=n=5:v=1:a=0,format=yuv420p[v]`,
    '-c:v', 'libx264', '-crf', '23',
    '-map', '[v]',
    //'-f', 'concat',
    //'-i', 'video.txt',
    //'-shortest',
    '-qscale', '0',
    //'-pix_fmt', 'yuv420p',
    '-vcodec', 'mpeg4',
    '-y', moviePath
], {
    cwd: __dirname,
    stdio: 'inherit'
});