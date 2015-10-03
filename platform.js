'use strict';

var inherits     = require('util').inherits,
	EventEmitter = require('events').EventEmitter;

function Platform() {
	if (!(this instanceof Platform)) return new Platform();

	var self = this;

	process.on('uncaughtException', function (error) {
		self.handleException(error);
		process.exit(1);
	});

	EventEmitter.call(this);
	Platform.init.call(this);
}

inherits(Platform, EventEmitter);

Platform.init = function () {
	var self = this;

	process.on('message', function (m) {
		if (m.type === 'ready')
			self.emit('ready', m.data.options);
		else if (m.type === 'log')
			self.emit('log', m.data);
	});
};

Platform.prototype.notifyReady = function (callback) {
	callback = callback || function () {
		};

	setImmediate(function () {
		process.send({
			type: 'ready'
		});

		callback();
	});
};

Platform.prototype.handleException = function (error, callback) {
	callback = callback || function () {
		};

	setImmediate(function () {
		if (!error) return callback(new Error('Error is required.'));

		process.send({
			type: 'error',
			data: {
				name: error.name,
				message: error.message,
				stack: error.stack
			}
		});
	});
};

module.exports = new Platform();