'use strict';

const TOKEN     = '57485320-5b32-4f4b-aca9-d03c5c52bafd',
	  SUBDOMAIN = 'reekohtest',
	  LOG_LEVEL = 'info',
	  TAGS      = 'tag1 tag2 tag3';

var cp     = require('child_process'),
	should = require('should'),
	logger;

describe('Loggly Logger', function () {
	this.slow(8000);

	after('terminate child process', function (done) {
		this.timeout(5000);

		logger.send({
			type: 'close'
		});

		setTimeout(function () {
			logger.kill('SIGKILL');
			done();
		}, 4500);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(logger = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 8 seconds', function (done) {
			this.timeout(8000);

			logger.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			logger.send({
				type: 'ready',
				data: {
					options: {
						token: TOKEN,
						subdomain: SUBDOMAIN,
						log_level: LOG_LEVEL,
						tags: TAGS
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#log', function () {
		it('should process JSON log data', function (done) {
			logger.send({
				type: 'log',
				data: JSON.stringify({
					title: 'Sample Log Title',
					description: 'Sample Log Data'
				})
			}, done);
		});
	});

	describe('#log', function () {
		it('should process String log data', function (done) {
			logger.send({
				type: 'log',
				data: 'Sample Log Data'
			}, done);
		});
	});
});