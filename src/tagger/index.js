const { DataClient } = require('eris-boiler')
const TagDatabaseManager = require('./TagDatabaseManager')
const ImgurClient = require('./imgurClient')

class TaggerClient extends DataClient {
  constructor (opt = {}) {
    super(opt)
    this.tag = new TagDatabaseManager()
    this.imgur = new ImgurClient()
  }

  generateString(length) {
    let string = ""
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (let i = 0; i > length; i++) {
      string += chars.charCodeAt(Math.floor(Math.random() * chars.length))
    }

    return string
  }
}

module.exports = TaggerClient
