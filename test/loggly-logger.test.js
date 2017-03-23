  'use strict'

  const amqp = require('amqplib')

  let _app = null
  let _channel = null
  let _conn = null

  describe('Loggly Logger', function () {
    this.slow(5000)

    before('init', () => {
      process.env.INPUT_PIPE = 'demo.pipe.logger'
      process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'
      process.env.CONFIG = '{"token": "243cffd1-4d8b-4061-8aaf-02604f5fa26d", "subdomain":"jcapiznon", "tags":"reekohtest", "logLevel":"info"}'

      amqp.connect(process.env.BROKER)
        .then((conn) => {
          _conn = conn
          return conn.createChannel()
        }).then((channel) => {
          _channel = channel
        }).catch((err) => {
          console.log(err)
        })
    })

    after('terminate child process', function (done) {
      _conn.close()
      done()
    })

    describe('#start', function () {
      it('should start the app', function (done) {
        this.timeout(8000)
        _app = require('../app')
        _app.once('init', done)
      })
    })

    describe('#log', function () {
      it('should log data', function (done) {
        this.timeout(15000)
        let dummyData = {foo: 'reekohtestfinal2'}
        _channel.sendToQueue('demo.pipe.logger', new Buffer(JSON.stringify(dummyData)))

        setTimeout(done, 5000)
      })
    })
  })
