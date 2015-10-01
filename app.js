'use strict';

var platform    = require('./platform'),
	winston = require('winston'),
	loglevel;

require('winston-loggly');

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {

	winston.add(winston.transports.Loggly, {
		token: options.token,
		subdomain: options.subdomain,
		tags: options.tag,
		json:true
	});

	loglevel = options.loglevel;

	platform.log('Connected to Loggly.');
	platform.notifyReady(); // Need to notify parent process that initialization of this plugin is done.

});

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {

	winston.log(loglevel,data, function(error) {
		console.error('Error on Loggly.', error);
		platform.handleException(error);
	});

});