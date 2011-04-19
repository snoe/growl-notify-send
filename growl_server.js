var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var Binary = require('binary');
var exec = require('child_process').exec;

server.on('message', function(buf) {
	Binary.parse(buf)
		.word8('ver')
		.word8('type')
		.tap(function(vars) {
			if (vars.type === 1) {
				this
					.word16bu('flags')
					.word16bu('notlen')
					.word16bu('titlen')
					.word16bu('desclen')
					.word16bu('applen')
					.buffer('notbuf', 'notlen')
					.buffer('titbuf', 'titlen')
					.buffer('descbuf', 'desclen')
					.buffer('appbuf', 'applen')
					.buffer('mdf', 16)
					.tap(function(vars) {
						var notification = vars.notbuf.toString('UTF8');
						var title = vars.titbuf.toString('UTF8');
						var description = vars.descbuf.toString('UTF8');
						var application = vars.appbuf.toString('UTF8');
						
						exec('notify-send "' + title + '" "' + description + '"');
					})
			}
		});
});
server.bind(9887);
