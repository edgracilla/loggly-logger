'use strict'

const reekoh = require('reekoh')
const plugin = new reekoh.plugins.Logger()

const domain = require('domain')
const winston = require('winston')
const isEmpty = require('lodash.isempty')

require('winston-loggly')

plugin.on('log', (logData) => {
  let d = domain.create()

  d.once('error', (error) => {
    console.error(error)
    plugin.logException(error)
    d.exit()
  })

  d.run(() => {
    let logLevel = plugin.config.logLevel || 'info'

    if (logData.level) {
      logLevel = logData.level
      delete logData.level
    }
    winston.log(logLevel, logData, (error) => {
      if (error) {
        console.error('Error on Loggly.', error)
        plugin.logException(error)
      }
      plugin.log(JSON.stringify({
        title: 'Log sent to Loggly',
        data: logData
      }))

      d.exit()
    })
  })
})

plugin.once('ready', () => {
  let tags = (isEmpty(plugin.config.tags)) ? [] : plugin.config.tags.split(' ')

  winston.add(winston.transports.Loggly, {
    token: plugin.config.token,
    subdomain: plugin.config.subdomain,
    tags: tags,
    json: true
  })
  plugin.log('Loggly has been initialized.')
  plugin.emit('init')
})

module.exports = plugin
