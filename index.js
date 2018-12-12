require('dotenv').load()
const { resolve } = require('path')

const {
  TOKEN,
  DATABASE_URL,
  DB_CLIENT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST
} = process.env

const tables = require('./config/database.json')
const defaultSettings = require('./config/settings.json')

const TaggerClient = require('./src/tagger')

const bot = new TaggerClient({
  token: TOKEN,
  qbOptions: {
    data: {
      connectionInfo: DATABASE_URL || {
        DB_NAME,
        DB_USER,
        DB_PASS,
        DB_HOST
      },
      client: DB_CLIENT
    }
  },
  defaultSettings,
  sourceFolder: resolve('./src'),
  tables
})

bot.connect()
