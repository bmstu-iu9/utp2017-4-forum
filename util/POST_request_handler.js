'use strict';

const fm = require('../file_system/file_manager');
const url = require('url');
const sm = require('../util/session_manager');
const html_gen = require('../HTML_generator/html_generator');

const get_location = (location) => {
	if (location.lastIndexOf('.') != -1) {
		return '..' + location.substring(0, location.lastIndexOf('/'));
	}
	
	return '..' + location;
}

const strip_location = (location) => {
	return location.replace('..', '');
}

const get_back = (location) => {
	return location.substring(0, location.lastIndexOf('/'));
}	

const get_front = (location) => {
	return location.substring(location.lastIndexOf('/') + 1);
}

const handler = (request, response, data, session) => {
	try {
		data = JSON.parse(data);
		
		response.writeHead(200, { "content-type" : "text/html" });
		
		if (data.type.localeCompare('add_article') == 0) {
			response.write(strip_location(add_article(data)));
		} else if (data.type.localeCompare('add_comment') == 0) {
			response.write(strip_location(add_comment(data)));
		} else if (data.type.localeCompare('remove_article') == 0) {
			response.write(strip_location(remove_article(data)));
		} else if (data.type.localeCompare('remove_comment') == 0) {
			response.write(strip_location(remove_comment(data)));
		} else {
			console.log('goddamn');
			response.write('/extern/access_denied.html');
		}
		
		response.end();
	} catch (err) {
		//console.log(err);
		response.end();
	}
}

const add_article = (data) => {
	let location = get_location(data.location);
	let info = JSON.parse(fm.read_file(location + '/info.json'));
	
	info.list.push(data.article);
	info.count++;
	fm.write_file(location + '/info.json', JSON.stringify(info));
	html_gen.generate(location);
	
	location += '/' + data.article;
	fm.mkdir(location);
	info = {
		type : "article",
		owner : data.login,
		count : 0,
		list : [],
		access : "authorized",
		text : data.text
	};
	fm.write_file(location + '/info.json', JSON.stringify(info));
	html_gen.generate(location);
	
	return location;
}

const add_comment = (data) => {
	let location = get_location(data.location);
	let info = JSON.parse(fm.read_file(location + '/info.json'));
	
	info.count++;
	info.list.push(info.count + '');
	fm.write_file(location + '/info.json', JSON.stringify(info));
	
	fm.write_file(location + '/' + info.count + '.json', JSON.stringify({
		type : "comment",
		owner : data.login,
		access : "authorized",
		text : data.text
	}));
	html_gen.generate(location);
	
	return location;
}

const remove_article = (data) => {
	let location = get_location(data.location);
	let info = JSON.parse(fm.read_file(location + '/' + data.article + '/info.json'));
	
	if (data.login.localeCompare(info.owner) == 0 && data.password.localeCompare(sm.get_password(data.login)) == 0) {
		info = JSON.parse(fm.read_file(location + '/info.json'));
		
		info.list = info.list.filter( (elem) => {
			return elem.localeCompare(data.article) != 0;
		});
		info.count = info.list.length;
		
		fm.write_file(location + '/info.json', JSON.stringify(info));
		fm.rmdir(location + '/' + data.article);
		html_gen.generate(location);
		
		return location;
	} else {
		return '../extern/access_denied.html';
	}
}

const remove_comment = (data) => {
	let location = get_location(data.location);
	let info = JSON.parse(fm.read_file(location + '/' + data.comment + '.json'));
	
	if (data.login.localeCompare(info.owner) == 0 && data.password.localeCompare(sm.get_password(data.login)) == 0 || 
		data.login.localeCompare(JSON.parse(fm.read_file(location + '/info.json')).owner) == 0 
		&& data.password.localeCompare(sm.get_password(data.login)) == 0) {
		info = JSON.parse(fm.read_file(location + '/info.json'));
		
		info.list = info.list.filter( (elem) => {
			return elem.localeCompare(data.comment) != 0;
		});
		
		fm.write_file(location + '/info.json', JSON.stringify(info));
		fm.delete_file(location + '/' + data.comment + '.json');
		html_gen.generate(location);
		
		return location;
	} else {
		return '../extern/access_denied.html';
	}
}

module.exports.handler = handler;
