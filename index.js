const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');
const fs = require('fs');
const sharp = require('sharp');
const errorHandler = require('./src/js/errorHandler');
const readImage = require('./src/js/readImage');

const app = express();
const PORT = process.env.PORT || 3000;

const videoFile = 'video.txt';
let audioFile = 'audio/follow-the-river.mp3';
let voiceFile = 'audio/voice-over.mp3';

let voiceDefault = true;
let musicDefault = true;

app.use(fileUpload());

// POST endpoint to upload images
app.post('/upload', async (req, res) => {
        errorHandler.IsInputEmpty(req, res);

        // Save uploaded images
        const images = req.files.images;
        const imagePaths = [];

        readImage.convertAllImages(images, imagePaths);
        console.log(imagePaths);
        
        //if voice upload has something in it, store it in path, otherwise just use default
        if (req.files.voice != null) {
            req.files.voice.mv(req.files.voice.name);
            voiceFile = req.files.voice.name;
            voiceDefault = false;
        }
        //if music upload has something in it, store it in path, otherwise just use default
        if (req.files.music != null) {
            req.files.music.mv(req.files.music.name);
            audioFile = req.files.music;
            musicDefault = false;
        }

        //if old video.txt file is present, remove it before starting another video
        if(fs.existsSync(path.join(__dirname,videoFile))) 
        { 
            fs.unlinkSync(videoFile);
        }

        
        //loop through imagepath array and create video.txt file based on results
        imagePaths.forEach((imagePath) => {
            //file -> the file to add to the video
            //duration -> the duration of the image in the video
            const joined = path.join(__dirname,imagePath);
            const content = `file '${joined}' \nduration 4\n`;
            fs.appendFileSync(path.join(__dirname, videoFile), content, err => {
                if (err) {
                    console.error(err);
                }
            });
        });

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
            '-report',
            '-safe', '0',
            //'-r', '1',
            '-f', 'concat',
            '-i', videoFile,
            '-i', audioFile,
            '-i', voiceFile,
            '-map', '0:v:0', '-map', '1:a:0', '-map', '2:a:0', 
            '-filter_complex', "[1:a]volume=volume=-24dB[a0];[2:a]volume=volume=0dB[a1]; [a0][a1]amerge=inputs=2; zoompan=z='min(zoom+0.0015,1.5)':d=700:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
            //'-af', 'volume=-24dB',
            '-shortest',
            '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
            '-pix_fmt', 'yuvj422p',
            '-vcodec', 'mpeg4',
            '-y', moviePath
        ], {
            cwd: __dirname,
            stdio: 'inherit'
        });

        ffmpegProcess.on('close', () => {
            // Delete temporary image files
            imagePaths.forEach((image) => {fs.unlinkSync(image);});
            //Send the movie file as a response
            res.download(moviePath, () => {
                // Delete the movie file after sending
                fs.unlinkSync(moviePath);
                if (!voiceDefault)
                    fs.unlinkSync(voiceFile);
                if (!musicDefault)
                   fs.unlinkSync(audioFile);
            });
        });
});


// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
