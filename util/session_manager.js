'use strict';

const fm = require('../file_system/file_manager');

const get_password = (login) => {	
	let password = '';
	
	get_database().some( (elem) => {
		if (elem.user == login)
			password = elem.password;
		return elem.user == login;
	});
	
	return password == '' ? undefined : password;
}

const get_database = () => {
	return fm.read_file('../auth/secret.txt').split('\n').filter( (elem) => {
		return elem != undefined && elem != '' && elem != '\r'; 
		}).map( (elem) => { 
		return { login : elem.split('$')[0], password : elem.split('$')[1].replace('\r', '') };
	});
}

const pair_lookup = (login, password, database) => {
	return database.some( (elem) => { 
		return elem.login == login && elem.password == password;
	});
}

const new_user = (login, password, id) => {
	return {
		user : login,
		password : password,
		time : new Date(),
		id : id,
	};
}

const add_user = (user, session) => {
	if (!session.some( (elem) => { 
		if (elem.user == user.user)
			elem = user;
		return elem.user == user.user
	})) {
		session.push(user);
	}
}

const is_unregistered = (login, password, database) => {
	let f = false;
	
	f |= database.some( (elem) => { 
		return elem.login == login;
	});
	
	return !f;
}

const register = (login, password) => {
	fm.append_file('../auth/secret.txt', login + '$' + password + '\n');
}

let database = get_database();

module.exports.register = register;
module.exports.is_unregistered = is_unregistered;
module.exports.get_password = get_password;
module.exports.pair_lookup = pair_lookup;
module.exports.new_user = new_user;
module.exports.add_user = add_user;
module.exports.get_database = get_database;
module.exports.database = database;
