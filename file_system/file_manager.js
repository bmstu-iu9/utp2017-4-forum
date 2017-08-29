'use strict';

const fs = require('fs');

const mkdir = (path) => {
	fs.mkdirSync(path);
}

const rmdir = (path) => {
	fs.rmdirSync(path);
}

const append_file = (path, data) => {
	fs.appendFileSync(path, data);
}

const write_file = (path, data) => {
	fs.writeFileSync(path, data);
}

const read_file = (path) => {
	return fs.readFileSync(path, 'utf8');;
}

const delete_file = (path) => {
	fs.unlinkSync(path);
}

const modify_file = (path, template, str) => {
	write_file(path, read_file(path).replace(template, str));
}

module.exports.rmdir = rmdir;
module.exports.mkdir = mkdir;
module.exports.modify_file = modify_file;
module.exports.delete_file = delete_file;
module.exports.append_file = append_file;
module.exports.write_file = write_file;
module.exports.read_file = read_file;
