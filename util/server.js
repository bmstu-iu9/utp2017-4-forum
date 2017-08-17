'use strict';

const http = require('http');
const fm = require('../file_system/file_manager');

let session = [];

const handler = (request, response) => {
	if (request.url == '/' || request.url == '') {
		response.writeHead(200, { "content-type" : "text/html" });
		response.write(fm.read_file('../extern/greetings.html'));
		response.end();
	} else if (request.url == '/authorization') {
		console.log('authorization request');
		response.writeHead(200, { "content-type" : "text/html" });
		response.write(fm.read_file('../extern/authorization.html'));
		response.end();
	} else {
		response.writeHead(404, { "content-type" : 'text/plain' });
		response.end();
	}
	
};

http.createServer(handler).listen(80);
