const EventEmitter = require('events');
const emitter = new EventEmitter();

module.exports = class GlobalEvents extends EventEmitter {
    constructor() {
        super();
        if (GlobalEvents.instance instanceof GlobalEvents) {
            return GlobalEvents.instance;
        }

        GlobalEvents.instance = this;
    }
}