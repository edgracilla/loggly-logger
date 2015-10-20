'use strict';

var winston  = require('winston'),
	platform = require('./platform'),
	logLevel;

require('winston-loggly');

/*
 * Listen for the data event.
 */
platform.on('log', function (data) {
	winston.log(logLevel, data, function (error) {
		if (!error) return;

		console.error('Error on Loggly.', error);
		platform.handleException(error);
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

	platform.log('Loggly Logger Initialized.');
	platform.notifyReady();
});