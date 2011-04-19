var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var Binary = require('binary');
var exec = require('child_process').exec;

Binary.stream(server, "message")
	.word8('ver')
	.word8('type')
	.word16bu('flags')
	.word16bu('notlen')
	.word16bu('titlen')
	.word16bu('desclen')
	.word16bu('applen')
	.buffer('notbuf', 'notlen')
	.buffer('titbuf', 'titlen')
	.buffer('descbuf', 'desclen')
	.buffer('appbuf', 'applen')
	.tap(function(vars) {
		var notification = vars.notbuf.toString('UTF8');
		var title = vars.titbuf.toString('UTF8');
		var description = vars.descbuf.toString('UTF8');
		var application = vars.appbuf.toString('UTF8');
		exec('notify-send "' + title + '" "' + description + '"');
	});
server.bind(9887);
