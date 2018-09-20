const { Command } = require('eris-boiler')
const { get } = require('superagent')

module.exports = (bot) => new Command(bot, {
    name: 'tag',
    description: 'Finds, Adds, Remove, or Edit tags\n',
    options: {
        deleteResponse: false
    },
    run: async ({ msg, params }) => {
        let { prefix } = await bot.dbm.getSettings(msg.channel.guild.id)
        if (params.length !== 0) return await doAction(params, msg, bot)
        else return `I\'m not sure if you\'re doing this correctly. Try doing '${prefix}help tag'`
    }
})

async function doAction([cmd, ...values], msg, client) {
    const key = values[0]

    values.shift()
    let value = undefined
    if (values.length !== 0) value = values
    if (msg.attachments.length !== 0) value = msg.attachments[0].url

    switch (cmd) {
        case 'add':
        case 'create':
            if (!key) return 'Missing key!'
            if (!value) return 'Missing value!'
            await client._tagger.add(msg.author.id, key, (Array.isArray(value) ? value.join(' ') : value))
            return `Added tag \`${key}\` with value of ${Array.isArray(value) ? value.join(' ') : value}`
        case 'delete':
        case 'remove':
            if (!key) return 'Missing key!'
            if (!(await client._tagger.get(key))) return 'Tag doesn\'t exist'
            if (msg.author.id !== (await client._tagger.get(key)).id) return 'Nope'

            await client._tagger.remove(key)
            return `Deleted tag \`${key}\``
        case 'edit':
        case 'update':
            if (!key) return 'Missing key!'
            if (!value) return 'Missing value!'
            if (!(await client._tagger.get(key))) return 'Tag doesn\'t exist'
            if (msg.author.id !== (await client._tagger.get(key)).id) return 'Nope'

            await client._tagger.edit(key, (Array.isArray(value) ? value.join(' ') : value))
            return `Updated tag \`${key}\` to ${Array.isArray(value) ? value.join(' ') : value}`
        case 'list':
        case 'tags':
            const values = await client._tagger.grabUserTags(msg.author.id)
            if (values.length === 0) return 'No tags found for you.'

            return { 
                embed: {
                    description: values.map(({ key }) => key).join('\n')
                } 
            }
        case 'search':
        case 'find':
            let tags = await client._tagger.grabTags()
            if (tags.length === 0) return 'No tags found.'
            tags = tags.filter(t => t.key.includes(key))

            return { 
                embed: {
                    description: tags.map(({ key }) => key).join('\n')
                } 
            }
        default:
            const tag = await client._tagger.get(cmd)
            const isImagRegex = new RegExp(/^https:?\/(.*).(png|jpeg|jpg|gif)/)

            if (!tag) return `Tag \`${cmd}\` doesn't exists`
            if (isImagRegex.test(tag.value)) return await grabImage(tag)

            return { content: `Tag \`${tag.key}\` found.\n${tag.value}` }
    }
}

async function grabImage(tag) {
    const { body } = await get(tag.value)
    const ext = tag.value.match(/^https:?\/(.*).(png|jpeg|jpg|gif)/)[2]

    return { content: `Tag \'${tag.key}\' found.`, file: { file: body, name: `loli_tagger.image.${ext}` } }
}