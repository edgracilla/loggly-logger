'use strict';

var domain   = require('domain'),
	winston  = require('winston'),
	platform = require('./platform'),
	level;

require('winston-loggly');

/*
 * Listen for the data event.
 */
platform.on('log', function (logData) {
	var d = domain.create();

	d.once('error', function () {
		winston.log(level, logData, function (error) {
			if (error) {
				console.error('Error on Loggly.', error);
				platform.handleException(error);
			}

			d.exit();
		});
	});

	d.run(function () {
		logData = JSON.parse(logData);

		var logLevel = level;

		if (logData.level) {
			logLevel = logData.level;
			delete logData.level;
		}

		winston.log(logLevel, logData, function (error) {
			if (error) {
				console.error('Error on Loggly.', error);
				platform.handleException(error);
			}

			d.exit();
		});
	});
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	var d = domain.create();

	d.on('error', function (error) {
		console.error(error);
		platform.handleException(error);
		platform.notifyClose();
	});

	d.run(function () {
		winston.loggers.close();
		platform.notifyClose();
	});
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var isEmpty = require('lodash.isempty');
	var tags = (isEmpty(options.tags)) ? [] : options.tags.split(' ');

	level = options.log_level || 'info';

	winston.add(winston.transports.Loggly, {
		token: options.token,
		subdomain: options.subdomain,
		tags: tags,
		json: true
	});

	platform.notifyReady();
});