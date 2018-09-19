require('dotenv').load()

const tables = require('./config/database.json')

const TaggerClient = require('./utils/client')
const client = new TaggerClient({ sourceFolder: './src', tables })

client.connect()