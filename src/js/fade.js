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
const moviePath = path.join(__dirname, '../../public/output/crossfade.mp4');
const ffmpegProcess = spawn('ffmpeg', [
    //'-report',
    //'-safe', '0',
    '-r', '25',
    //'-filter_complex', `scale=8000x4000, zoompan=z='min(zoom+0.0015,1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=25:s=hd1080`,
    '-loop', '1', '-t', '6', '-i', '../../public/overlays/overlay-image0.png',
    '-loop', '1', '-t', '7', '-i', '../../public/overlays/overlay-image1.png',
    '-loop', '1', '-t', '2', '-i', '../../public/overlays/overlay-image2.png',
    '-loop', '1', '-t', '4', '-i', '../../public/overlays/overlay-image3.png',
    '-loop', '1', '-t', '4', '-i', '../../public/overlays/overlay-image4.png',
    '-filter_complex',
    `[0:v]scale=1280:720,fade=t=out:st=5:d=1:alpha=1,setpts=PTS-STARTPTS[v0];
    [1:v]scale=1280:720,fade=t=in:st=0:d=1:alpha=1,setpts=PTS-STARTPTS+6/TB[v1];
    [1:v]scale=1280:720,fade=t=out:st=5:d=1:alpha=1,setpts=PTS-STARTPTS+6/TB[v2];
    [2:v]scale=1280:720,fade=t=in:st=0:d=1:alpha=1,setpts=PTS-STARTPTS+13/TB[v3];
    [2:v]scale=1280:720,fade=t=out:st=6:d=1:alpha=1,setpts=PTS-STARTPTS+13/TB[v4];
    [3:v]scale=1280:720,fade=t=in:st=0:d=1:alpha=1,setpts=PTS-STARTPTS+17/TB[v5];
    [3:v]scale=1280:720,fade=t=out:st=1:d=1:alpha=1,setpts=PTS-STARTPTS+17/TB[v6];
    [4:v]scale=1280:720,fade=t=in:st=0:d=1:alpha=1,setpts=PTS-STARTPTS+21/TB[v7];
    [v0][v1]overlay,format=yuv420p[v01];
    [v01][v2]overlay,format=yuv420p[v02];
    [v02][v3]overlay,format=yuv420p[v03];
    [v03][v4]overlay,format=yuv420p[v04];
    [v04][v5]overlay,format=yuv420p[v05];
    [v05][v6]overlay,format=yuv420p[v06];
    [v06][v7]overlay,format=yuv420p[out]`,
    // `[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=3:d=1[v0];
    // [1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1[v1];
    // [1:v]fade=t=out:st=3:d=1[v2];
    // [2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=1[v3];
    // [v0][v1]xfade=transition=fade:duration=1:offset=3[v01];
    // [v01][v3]xfade=transition=fade:duration=1:offset=6,format=yuv420p[out]`,
    '-map', '[out]',
    '-c:v', 'libx264', '-crf', '23',
    //'-f', 'concat',
    //'-i', 'video.txt',
    //'-shortest',
    //'-q:v', '0',
    //'-pix_fmt', 'yuv420p',
    //'-vcodec', 'mpeg4',
    '-y', moviePath
], {
    cwd: __dirname,
    stdio: 'inherit'
});