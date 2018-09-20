const { Command } = require('eris-boiler')
const { get } = require('superagent')

module.exports = (bot) => new Command(bot, {
    name: 'tag',
    options: {
        deleteResponse: false
    },
    description: 'Finds, Adds, Remove, or Edit tags\n',
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
            const result = await client._tagger.add(msg.author.id, key, (Array.isArray(value) ? value.join(' ') : value))
            if (result === false) return 'Current link doesn\'t exists... please try another.'
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
                    title: `${msg.author.username} Tags.`,
                    description: values.map(({ key }) => key).join('\n')
                } 
            }
        case 'search':
        case 'find':
            let tags = await client._tagger.grabTags(key)
            if (tags.length === 0) return 'No tags found.'

            return { 
                embed: {
                    title: `Found tags with relation of ${key}`,
                    description: tags.map(({ key }) => key).join('\n')
                } 
            }
        case 'info':
        case 'about':
            if (!key) return `Missing tag key!`
            const tagInfo = await client._tagger.get(key)
            if (!tagInfo) return `Tag \`${key}\` doesn't exists`
            const user = client.users.get(tagInfo.id)

            return {
                embed: {
                    author: {
                        name: `${user.username}#${user.discriminator}`,
                        icon_url: user.avatarURL
                    },
                    fields: [
                        {
                            name: 'Tag Name',
                            value: tagInfo.key
                        },
                        {
                            name: 'Tag Value',
                            value: tagInfo.value
                        },
                        {
                            name: 'Use Count',
                            value: tagInfo.count
                        }
                    ]
                }
            }
        default:
            const tag = await client._tagger.get(cmd)
            const isImagRegex = new RegExp(/^(https|http):?\/(.*).(png|jpeg|jpg|gif)/)

            if (!tag) return `Tag \`${cmd}\` doesn't exists`
            if (isImagRegex.test(tag.value)) return await grabImage(client, tag)
            await client._tagger.count(tag.key)

            return { content: `Tag \`${tag.key}\` found.\n${tag.value}` }
    }
}

async function grabImage(client, tag) {
    const { body } = await get(tag.value)
    const ext = tag.value.match(/^https:?\/(.*).(png|jpeg|jpg|gif)/)[2]
    await client._tagger.count(tag.key)

    return { content: `Tag \'${tag.key}\' found.`, file: { file: body, name: `loli_tagger.image.${ext}` } }
}