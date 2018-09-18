require('dotenv').load()

const TaggerClient = require('./utils/client')
const client = new TaggerClient({ sourceFolder: './src' })

client.connect()