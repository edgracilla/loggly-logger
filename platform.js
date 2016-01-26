'use strict';

/**
 * Utility function to validate Error Objects
 * @param val The value to be evaluated.
 * @returns {boolean}
 */
var isError = function (val) {
	return (!!val && typeof val === 'object') && typeof val.message === 'string' && Object.prototype.toString.call(val) === '[object Error]';
};

/**
 * Main object used to communicate with the platform.
 * @returns {Platform}
 * @constructor
 */
function Platform() {
	if (!(this instanceof Platform)) return new Platform();

	require('events').EventEmitter.call(this);
	Platform.init.call(this);
}

require('util').inherits(Platform, require('events').EventEmitter);

/**
 * Init function for Platform.
 */
Platform.init = function () {
	process.on('SIGINT', () => {
		this.emit('close');

		setTimeout(() => {
			this.removeAllListeners();
			process.exit();
		}, 2000);
	});

	process.on('SIGTERM', () => {
		this.emit('close');

		setTimeout(() => {
			this.removeAllListeners();
			process.exit();
		}, 2000);
	});

	process.on('uncaughtException', (error) => {
		console.error('Uncaught Exception', error);
		this.handleException(error);
		this.emit('close');

		setTimeout(() => {
			this.removeAllListeners();
			process.exit(1);
		}, 2000);
	});

	process.on('message', (m) => {
		if (m.type === 'ready')
			this.emit('ready', m.data.options);
		else if (m.type === 'log')
			this.emit('log', m.data);
		else if (m.type === 'close')
			this.emit('close');
	});
};

/**
 * Needs to be called once in order to notify the platform that the plugin has already finished the init process.
 * @param {function} [callback] Optional callback to be called once the ready signal has been sent.
 */
Platform.prototype.notifyReady = function (callback) {
	callback = callback || function () {
		};

	setImmediate(() => {
		process.send({
			type: 'ready'
		}, callback);
	});
};

/**
 * Notifies the platform that resources have been released and this plugin can shutdown gracefully.
 * @param {function} [callback] Optional callback to be called once the close signal has been sent.
 */
Platform.prototype.notifyClose = function (callback) {
	callback = callback || function () {
		};

	setImmediate(() => {
		process.send({
			type: 'close'
		}, callback);
	});
};

/**
 * Logs errors to all the attached exception handlers in the topology.
 * @param {error} error The error to be handled/logged
 * @param {function} callback Optional callback to be called once the error has been sent.
 */
Platform.prototype.handleException = function (error, callback) {
	callback = callback || function () {
		};

	setImmediate(() => {
		if (!isError(error)) return callback(new Error('A valid error object is required.'));

		process.send({
			type: 'error',
			data: {
				name: error.name,
				message: error.message,
				stack: error.stack
			}
		}, callback);
	});
};

module.exports = new Platform();