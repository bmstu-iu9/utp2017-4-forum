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
		authorization_error(response);
		return;
	}
	
	if (verify_login(login) && verify_password(password) && sm.pair_lookup(login, password, sm.get_database())) {
		sm.add_user(sm.new_user(data.split('$')[0], data.split('$')[1], request.connection.remoteAddress), session);
		
		response.writeHead(200, { "content-type" : "text/plain" });
		response.write('../topics');
		response.end();
	}
	else {
		authorization_error(response);
	}	
}

const session_check = (login, password) => {	
	if (verify_login(login) && verify_password(password) && sm.pair_lookup(login, password, sm.get_database())) {		
		response.writeHead(200, { "content-type" : "text/plain" });
		response.write('../topics');
		response.end();
	}
	else {
		authorization_error(response);
	}
}

const authorization_error = (response) => {
	console.log('authorization error');
	response.writeHead(401, { "content-type" : "text/plain" });
	response.write('authorization');
	response.end();
}

module.exports.handler = handler;
module.exports.session_check = session_check;
