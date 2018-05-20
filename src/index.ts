#!/usr/bin/env node
import program from 'commander'
require('dotenv').config()
const pjson = require('../package.json')

program.version(pjson.version).description(pjson.description)

program
  .command('mysqldump <target>')
  .description('Use mysqldump to download target defined in .env file.')
  .option('-t --tunnel', 'open an ssh tunnel before running mysqldump')
  .option(
    '-p --path <path>',
    'Path to save mysql dump, default is saving into a file named target.sql'
  )
  .action((target, options) => {
    try {
      require('./lib').mysqldump({ target, options })
    } catch (e) {
      console.error(e.message)
      process.exit(1)
    }
  })

program.parse(process.argv)

if (process.argv.slice(2).length === 0) {
  console.error('Heyo! Run "hamstr --help" for the manual.')
}
