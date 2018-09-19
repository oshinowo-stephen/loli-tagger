const { DataClient } = require('eris-boiler')
const TagHandler = require('./tagHandler')

class LoliTagger extends DataClient {
    constructor(opt = {}) {
        super(opt)

        this._tagger = new TagHandler()
    }
}

module.exports = LoliTagger
