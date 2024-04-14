// filesRouter.js
const express = require('express');
const router = express.Router();
const { getSentences, cleanInput }  = require('../controllers/textController');
const Settings = require('../controllers/configController');
const config = new Settings();

const GlobalEvents = require('../controllers/eventController');
const events = new GlobalEvents();

// Define routes using the router instance
router.get('/', (req, res) => {
    res.render('index');
});

// Middleware to parse incoming request bodies (form data)
router.use(express.urlencoded({ extended: true }));

router.post('/upload', (req, res) => {
    if (!req.files || !req.body)
    {
        res.redirect('/');
        return;
    }

    const { text } = req.body;
    const { images } = req.files;
    events.emit('poem', text);
    events.emit('images', images);
    res.locals.text = getSentences(text);
    res.render('upload', {  text : res.locals.text  });
});

module.exports = router;