'use strict';

const verify_login = require('../util/verifier').verify_login;
const verify_password = require('../util/verifier').verify_password;
const sm = require('../util/session_manager');

const handler = (request, response, data, session) => {
	let login = '', password = '';
	
	try {
		login = data.split('$')[0];
		password = data.split('$')[1];
	} catch (e) {
		registration_error(response);
		return;
	}
	
	if (verify_login(login) && verify_password(password) && sm.is_unregistered(login, password, sm.get_database())) {
		sm.register(login, password);
		sm.add_user(sm.new_user(data.split('$')[0], data.split('$')[1], request.connection.remoteAddress), session);
		
		response.writeHead(200, { "content-type" : "text/plain" });
		response.write('../extern/test.html');
		response.end();
	}
	else {
		registration_error(response);
	}	
}

const registration_error = (response) => {
	console.log('registration error');
	response.writeHead(401, { "content-type" : "text/plain" });
	response.write('registration');
	response.end();
}

module.exports.handler = handler;
