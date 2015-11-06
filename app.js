'use strict';

var isJSON = require('is-json'),
	winston  = require('winston'),
	platform = require('./platform'),
	logLevel;

require('winston-loggly');

/*
 * Listen for the data event.
 */
platform.on('log', function (logData) {
	if (isJSON(logData))
		logData = JSON.parse(logData);

	winston.log(logLevel, logData, function (error) {
		if (!error) return;

		console.error('Error on Loggly.', error);
		platform.handleException(error);
	});
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	var domain = require('domain');
	var d = domain.create();

	d.on('error', function(error) {
		console.error(error);
		platform.handleException(error);
		platform.notifyClose();
	});

	d.run(function() {
		winston.loggers.close();
		platform.notifyClose();
	});
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var _ = require('lodash');
	var tags = (_.isEmpty(options.tags)) ? [] : options.tags.split(' ');

	logLevel = options.log_level || 'info';

	winston.add(winston.transports.Loggly, {
		token: options.token,
		subdomain: options.subdomain,
		tags: tags,
		json: true
	});

	platform.notifyReady();
});