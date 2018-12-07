const { DatabaseManager, Logger } = require('eris-boiler')
const QueryBuilder = require('simple-knex')

class TagDatabaseManager extends DatabaseManager {
  constructor () {
    super({}, Logger, QueryBuilder)
  }

  async addTag (userId, key, src) {
    return this._qb.insert({ table: 'tags', data: { userId, key, src } })
      .catch(() => this._qb.update({ table: 'tags', data: { key, src }, where: { userId } }))
  }

  getTag (key) {
    return this._qb.get({ table: 'tags', where: { key } })
  }

  updateTag (key, src) {
    return this._qb.update({ table: 'tags', data: { src }, where: { key } })
  }

  removeTag (key) {
    return this._qb.delete({ table: 'tags', where: { key } })
  }

  selectTagsForUser (userId) {
    return this._qb.select({ table: 'tags', where: { userId } })
  }

  searchLikeTags (key) {
    return this._qb._knex('tags').select('*').where('key', 'like', `%${key}%`)
      .then((rows) => rows[0] ? rows : [])
  }

  incrementTagCount (key) {
    return this._qb.increment({ table: 'tags', column: 'count', amount: 1, where: { key } })
  }
}

module.exports = TagDatabaseManager
