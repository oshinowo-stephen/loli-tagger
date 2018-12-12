const { DataClient } = require('eris-boiler')
const TagDatabaseManager = require('./TagDatabaseManager')

class TaggerClient extends DataClient {
  constructor (opt = {}) {
    super(opt)
    this.tag = new TagDatabaseManager()
  }
}

module.exports = TaggerClient
