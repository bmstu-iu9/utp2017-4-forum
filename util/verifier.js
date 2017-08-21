'use strict'

const special_symbols = ['\n', ';', '.', ',', '$', '&', '|', '\\', '/', '~', '%', '@', '#'];

const general_validity = (input) => {
	let str = '';
	
	if (input == "")
		str += 'login is null\n';
	
	if (special_symbols.some( (elem) => { return input.lastIndexOf(elem) != -1; }))
		str += 'special symbols aren\'t allowed';
	
	return str;
}

const verify_login = (login) => {
	let str = '';
	
	str += general_validity(login);
	
	if (str != '')
		console.log(str);
	
	return str == '';
}

const verify_password = (password) => {
	let str = '';
		
	str += general_validity(password);
	
	if (password.length < 8)
		str += 'password is too short\n';
	else if (password.length >= 64)
		str += 'password is too long\n';
	
	if (str != '')
		console.log(str);
	
	return str == '';
}

const verify_data = (data) => {
	let login = '', password = '';
	
	try {
		login = data.split('$')[0];
		password = data.split('$')[1];
	} catch (e) {
		return false
	}
	
	return verify_login(login) && verify_password(password);
}

module.exports.verify_data = verify_data;
module.exports.verify_login = verify_login;
module.exports.verify_password = verify_password;
