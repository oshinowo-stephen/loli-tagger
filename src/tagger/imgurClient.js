const imgur = require('imgur')

const TaggerDatabaseManager = require('./TagDatabaseManager')

class ImgurClient {
  constructor () {
    this.tdbm = new TaggerDatabaseManager()

    imgur.setClientId(process.env.IMGUR_CLIENT_ID)
    imgur.setAPIUrl('https://api.imgur.com/3/')
  }

  async upload (id, imgObj) {
    const { data } = await imgur.uploadUrl(imgObj.image)

    try {
      await this.tdbm.addTag(id, imgObj.key, data.link)
    } catch (err) {
      return err
    }
  }

  async update (key, imgObj) {
    const { data } = await imgur.uploadUrl(imgObj)

    try {
      await this.tdbm.updateTag(key, data.link)
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

module.exports = ImgurClient
