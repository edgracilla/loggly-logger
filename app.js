'use strict';

var _        = require('lodash'),
	winston  = require('winston'),
	platform = require('./platform'),
	loglevel;

require('winston-loggly');

/*
 * Listen for the data event.
 */
platform.on('log', function (data) {
	winston.log(loglevel, data, function (error) {
		if (!error) return;

		console.error('Error on Loggly.', error);
		platform.handleException(error);
	});
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var tags = (_.isEmpty(options.tags)) ? [] : options.tags.split(' ');
	loglevel = options.loglevel || 'info';

	winston.add(winston.transports.Loggly, {
		token: '57485320-5b32-4f4b-aca9-d03c5c52bafd',
		subdomain: 'reekohtest',
		tags: tags,
		json: true
	});

	platform.notifyReady();
});