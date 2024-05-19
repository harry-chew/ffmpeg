module.exports = class Settings {
    constructor() {
        if (Settings.instance instanceof Settings) {
            return Settings.instance;
        }

        this.settings = {
            'images' : [],
            'imageTime' : 0,
            'resized' : [],
            'sentences' : [],
            'timings' : []
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
