const { DataClient } = require('eris-boiler')
const TagHandler = require('./tagHandler')

class LoliTagger extends DataClient {
    constructor(opt = {}) {
        super(opt)

        this._tagger = new TagHandler()

        this._tagger.initialize(this.guilds)
            .then(() => console.log('Init tables'))
            .catch(err => console.log(err))
    }
}

module.exports = LoliTagger
