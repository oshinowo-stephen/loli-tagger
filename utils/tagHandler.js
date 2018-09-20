const { DatabaseManager, Logger } = require('eris-boiler')
const QueryBuilder = require('simple-knex')

class TagHandler extends DatabaseManager {
    constructor() {
        super({}, Logger, QueryBuilder)
    }

    add(id, key, value) {
        return this._qb.insert({ table: 'tags', data: { id, key, value } })
            .catch(() => this._qb.update({ table: 'tags', data: { key, value }, where: { id } }))
    }

    get(key) {
        return this._qb.get({ table: 'tags', where: { key } })
    }

    edit(key, newValue) {
        return this._qb.update({ table: 'tags', data: { value: newValue }, where: { key } })
    }

    remove(key) {
        return this._qb.delete({ table: 'tags', where: { key } })
    }

    grabUserTags(id) {
        return this._qb.select({ table: 'tags', where: { id } })
    }

    grabTags() {
        return this._qb.select({ table: 'tags' })
    }
}

module.exports = TagHandler
