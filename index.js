require('dotenv').load()

const tables = require('./config/database.json')

const TaggerClient = require('./utils/client')
const client = new TaggerClient({
    token: process.env.TOKEN,
    defaultSettings: require('./config/settings.json'),
    sourceFolder: './src', 
    tables, 
})

client.connect()