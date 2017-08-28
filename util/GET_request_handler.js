'use strict';

const fm = require('../file_system/file_manager');
const url = require('url');
const sm = require('../util/session_manager');

const get_location = (location) => {
	if (location.lastIndexOf('.') != -1) {
		return '..' + location.substring(0, location.lastIndexOf('/') + 1);
	}
	
	return '..' + location;
}

const get_access = (location) => {
	return JSON.parse(fm.read_file(location + '/info.json')).access;
}

const get_owner = (location) => {
	return JSON.parse(fm.read_file(location + '/info.json')).owner;
}

const check_access = (login, password, location) => {
	let access = get_access(location);
	let owner = get_owner(location);
	
	if (owner == login && password == sm.get_password(login))
		return 'admin';
	else if (access == 'authorized')
		return 'user';
	else 
		return 'denied';
}

const get_login_password = (data) => {
	return {
		login : data.split(';')[0].split('=')[1],
		password : data.split(';')[1].split('=')[1]
	};
}

const handler = (request, response, session) => {
	try {
		let data = url.parse(request.url);
		let location = get_location(data.pathname);	
				
		response.writeHead(200, { "content-type" : "text/html" });
		
		if (location.split('/')[1] == 'extern') {
			response.write(fm.read_file('..' + data.pathname));
		} else {
			let ad = get_login_password(data.query);
			let access = check_access(ad.login, ad.password, location);			
			
			if (access == 'admin') {
				response.write(fm.read_file(location + '/admin.html'));		
			} else if (access == 'user') {
				response.write(fm.read_file(location + '/user.html'));	
			} else if (access == 'denied') {
				response.write(fm.read_file('../extern/access_denied.html'));		
			}
		}
		
		response.end();
	} catch (err) {
		console.log(err);
		response.end();
	}
}

module.exports.check_access = check_access;
module.exports.handler = handler;
