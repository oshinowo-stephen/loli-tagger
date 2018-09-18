const { DatabaseManager, Logger } = require('eris-boiler')
const tables  = require('../config/database.json')
const QueryBuilder = require('simple-knex')

class TagHandler extends DatabaseManager {
    constructor() {
        super(tables, Logger, QueryBuilder)
    }

    add(id, values) {
        return this._qb.insert({ table: 'tags', data: { id, ...values } })
    }

    get(id, key) {
        return this._qb.get({ table: 'tags', where: { id, key } })
    }

    edit(id, key, newValue) {
        return this._qb.update({ table: 'tags', data: { key, newValue }, where: { id } })
    }

    remove(id, key) {
        return this._qb.delete({ table: 'tags', where: { id, key } })
    }
}

module.exports = TagHandler
