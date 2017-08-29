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

const get_owner = (location) => {
	return JSON.parse(fm.read_file(location + '/info.json')).owner;
}

const get_back = (location) => {
	return location.substring(0, location.lastIndexOf('/') + 1);
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
			
		} else if (data.type.localeCompare('remove_article') == 0) {
			
		} else if (data.type.localeCompare('remove_comment') == 0) {
			
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
		access : "authorized",
		text : data.text
	};
	fm.write_file(location + '/info.json', JSON.stringify(info));
	html_gen.generate(location);
	
	return location;
}

module.exports.handler = handler;