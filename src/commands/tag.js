const { Command } = require('eris-boiler')

module.exports = (bot) => new Command(bot, {
    name: 'tag',
    description: 'Finds, Adds, Remove, or Edit tags',
    options: {
        deleteInvoking: false,
        deleteResponse: false
    },
    run: async ({ msg, params }) => {
        if (params) doAction(params, msg.channel.guild, bot)
    }
})

function doAction([cmd, ...values], guild, client) {
    const [key, value] = values

    switch (cmd) {
        case 'add':
            break;
        case 'delete':
            break;
        case 'edit':
            break;
        default:
            client._tagger.select(guild.id, cmd)
                .then(res => console.log(res))
                .catch(err => console.log(err))
    }
}