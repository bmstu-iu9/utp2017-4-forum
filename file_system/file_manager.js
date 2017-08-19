'use strict';

const fs = require('fs');

const append_file = (path, data) => {
	fs.appendFileSync(path, data);
}

const write_file = (path, data) => {
	fs.writeFileSync(path, data);
}

const read_file = (path) => {
	return fs.readFileSync(path, 'utf8');;
}

module.exports.append_file = append_file;
module.exports.write_file = write_file;
module.exports.read_file = read_file;
