const fs = require('fs');
const path = require('path');

const GlobalEvents = require('./eventController');
const events = new GlobalEvents();

// Find the root directory using process.cwd()
const rootDirectory = process.cwd();
// Resolve the root directory to get the absolute path
const rootPath = path.resolve(rootDirectory);
const imagePath = path.join(rootPath, 'temp');

module.exports = class Settings {
    constructor() {
        if (Settings.instance instanceof Settings) {
            return Settings.instance;
        }

        this.settings = {
            'images' : [],
            'resized' : [],
            'sentences' : []
        };

        Object.freeze(this);
        Settings.instance = this;
    }

    get(key) {
        if (this.settings.hasOwnProperty(key))
            return this.settings[key];
        else
            return 'no key';
    }

    set(key, value) {
        this.settings[key] = value;
    }
}

