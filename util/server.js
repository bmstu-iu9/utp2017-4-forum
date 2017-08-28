'use strict';

const http = require('http');
const fm = require('../file_system/file_manager');
const auth = require('../auth/authorization_handler');
const reg = require('../auth/registration_handler');
const GET = require('../util/GET_request_handler');

let session = [];

const process_post = (request, response, handler, session) => {
    let queryData = "";

    if(request.method == 'POST') {
        request.on('data', (data) => {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'});
				response.end();
                request.connection.destroy();
            }
        });

        request.on('end', () => {
            request.post = handler(request, response, queryData, session);
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

const handler = (request, response) => {
	console.log(request.url);
	if (request.url == '/' || request.url == '') {
		response.writeHead(200, { "content-type" : "text/html" });
		response.write(fm.read_file('../extern/greetings.html'));
		response.end();
	} else if (request.url == '/registration') {
		console.log('registration request');
		response.writeHead(200, { "content-type" : "text/html" });
		response.write(fm.read_file('../extern/registration.html'));
		response.end();
	} else if (request.url == '/authorization') {
		console.log('authorization request');
		response.writeHead(200, { "content-type" : "text/html" });
		response.write(fm.read_file('../extern/authorization.html'));
		response.end();
	} else if (request.method == 'POST') {
		if (request.url == '/auth') {
			process_post(request, response, auth.handler, session);
		} else if (request.url == '/reg') {
			process_post(request, response, reg.handler, session);
		} else if (request.url == '/sert') {
			process_post(request, response, auth.session_check, session);
		}
	} else if (request.method == 'GET') {
		GET.handler(request, response, session);
	} else {
		response.writeHead(404, { "content-type" : 'text/plain' });
		response.end();
	}
	
};

http.createServer(handler).listen(80);
