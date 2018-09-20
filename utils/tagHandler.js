const { DatabaseManager, Logger } = require('eris-boiler')
const QueryBuilder = require('simple-knex')
const { get } = require('superagent')

class TagHandler extends DatabaseManager {
    constructor() {
        super({}, Logger, QueryBuilder)
    }

    async add(id, key, value) {
        const isLinkRegex = new RegExp(/^(https|http):?\/(.*)/)
        if (isLinkRegex.test(value)) {
            try { 
                await get(value) 
            } catch (err) {
                return false
            }
        }
        
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

    grabTags(key) {
        return this._qb.select({ table: 'tags' })
            .then(results => results.filter(res => res.key.includes(key)))
    }

    count(key) {
        return this._qb.get({ table: 'tags', where: { key } })
            .then(rows => this._qb.update({ table: 'tags',  data: { count: (rows.count + 1) }, where: { key } }))
    }
}

module.exports = TagHandler
