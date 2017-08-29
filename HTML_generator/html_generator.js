'use strict';

const fm = require('../file_system/file_manager');

const get_template = (template) => {
	return fm.read_file('../HTML_generator/templates/' + template.replace('.html', '') + '.html');
}

const replace = (str, template, newstr) => {
	let arr = [];
	let pos = -1;
	
	while ((pos = str.indexOf(template, pos + 1)) != -1) {	
		arr.push( pos );
	}
	
	let k = 0;
	let rezult = '';
	
	for (let i = 0; i < arr.length; i++) {
		
		while(arr[i] > k) {
			rezult += str[k];
			k++;
		}
		rezult += newstr;
		k += template.length;
	}
	
	while(str.length > k) {
		rezult += str[k];
		k++;
	}
		
	return rezult;
}

const get_back = (location) => {
	return location.substring(0, location.lastIndexOf('/') + 1);
}	

const get_front = (location) => {
	return location.substring(location.lastIndexOf('/') + 1);
}	


const generate = (location) => {
	let info = JSON.parse(fm.read_file(location + '/info.json'));
		
	if (info.type == 'topic_list') {
		generate_topics(location, info);
	} else if (info.type == 'article_list') {
		generate_articles(location, info);
	} else if (info.type == 'article') {
		generate_article(location, info);
	} else {
		console.log('some shit: ' + info.type);
	}
}

const generate_topics = (location, info) => {
	let url_path = location.replace('..', '');
	let admin = get_template('general_html');
	let user = get_template('general_html');
	let admin_body = '';
	let user_body = '';
	let ln = '\n' + get_template('newline') + '\n';
	let divider = '\n' + get_template('divider') + '\n';
	let reloc = '\n' + get_template('relocation_button') + '\n';
	
	admin = admin.replace('title_blank', 'topics');
	user = user.replace('title_blank', 'topics');
		
	admin_body += reloc + ln;
	admin_body = replace(admin_body, 'bracket_blank', 'back');
	admin_body = replace(admin_body, 'location_blank', 'http://127.0.0.1:80/');
	admin_body = replace(admin_body, 'name_blank', '<-');
		
	user_body += reloc + ln;
	user_body = replace(user_body, 'bracket_blank', 'back');
	user_body = replace(user_body, 'location_blank', 'http://127.0.0.1:80/');
	user_body = replace(user_body, 'name_blank', '<-');
										
	info.list.forEach( (topic) => {
		admin_body += divider + ln + topic + ' : ' + ln + reloc + ln;
		admin_body = replace(admin_body, 'bracket_blank', topic);
		admin_body = replace(admin_body, 'location_blank', 'http://127.0.0.1:80' + url_path + '/' + topic);
		admin_body = replace(admin_body, 'name_blank', '->');
		
		user_body += divider + ln + topic + ' : ' +ln + reloc + ln;
		user_body = replace(user_body, 'bracket_blank', topic);
		user_body = replace(user_body, 'location_blank', 'http://127.0.0.1:80' + url_path + '/' + topic);
		user_body = replace(user_body, 'name_blank', '->');
	});
						
	admin = admin.replace('body_blank', admin_body);
	user = user.replace('body_blank', user_body);
		
	fm.write_file(location + '/admin.html', admin);
	fm.write_file(location + '/user.html', user);
}

const generate_articles = (location, info) => {
	let url_path = location.replace('..', '');
	let admin = get_template('general_html');
	let user = get_template('general_html');
	let admin_body = '';
	let user_body = '';
	let ln = '\n' + get_template('newline') + '\n';
	let divider = '\n' + get_template('divider') + '\n';
	let reloc = '\n' + get_template('relocation_button') + '\n';
	let action = '\n' + get_template('action_button') + '\n';
	let remove = '\n' + get_template('remove_article') + '\n';
	
	admin = admin.replace('title_blank', 'articles');
	user = user.replace('title_blank', 'articles');
		 
	admin_body += reloc;
	admin_body = replace(admin_body, 'bracket_blank', 'back');
	admin_body = replace(admin_body, 'location_blank', 'http://127.0.0.1:80/topics');
	admin_body = replace(admin_body, 'name_blank', '<-');
		
	user_body += reloc;
	user_body = replace(user_body, 'bracket_blank', 'back');
	user_body = replace(user_body, 'location_blank', 'http://127.0.0.1:80/topics');
	user_body = replace(user_body, 'name_blank', '<-');
	
	admin_body += reloc + ln;
	admin_body = replace(admin_body, 'bracket_blank', 'add');
	admin_body = replace(admin_body, 'location_blank', 'http://127.0.0.1:80/extern/add_article.html?location=' + url_path);
	admin_body = replace(admin_body, 'name_blank', 'add');
		
	user_body += reloc + ln;
	user_body = replace(user_body, 'bracket_blank', 'add');
	user_body = replace(user_body, 'location_blank', 'http://127.0.0.1:80/extern/add_article.html?location=' + url_path);
	user_body = replace(user_body, 'name_blank', 'add');
										
	info.list.forEach( (article) => {
		admin_body += divider + ln + article + ' : ' + ln + action + remove;
		admin_body = replace(admin_body, 'bracket_blank', article);
		admin_body = replace(admin_body, 'name_blank', 'remove');
		
		admin_body += reloc + ln;
		admin_body = replace(admin_body, 'bracket_blank', article);
		admin_body = replace(admin_body, 'location_blank', 'http://127.0.0.1:80' + url_path + '/' + article);
		admin_body = replace(admin_body, 'name_blank', '->');
		
		user_body += divider + ln + article + ' : ' + ln + reloc + ln;
		user_body = replace(user_body, 'bracket_blank', article);
		user_body = replace(user_body, 'location_blank', 'http://127.0.0.1:80' + url_path + '/' + article);
		user_body = replace(user_body, 'name_blank', '->');
	});
						
	admin = admin.replace('body_blank', admin_body);
	user = user.replace('body_blank', user_body);
		
	fm.write_file(location + '/admin.html', admin);
	fm.write_file(location + '/user.html', user);
}

const generate_article = (location, info) => {
	let url_path = location.replace('..', '');
	let admin = get_template('general_html');
	let user = get_template('general_html');
	let admin_body = '';
	let user_body = '';
	let ln = '\n' + get_template('newline') + '\n';
	let divider = '\n' + get_template('divider') + '\n';
	let reloc = '\n' + get_template('relocation_button') + '\n';
	let action = '\n' + get_template('action_button') + '\n';
	let remove_article = '\n' + get_template('remove_article') + '\n';
	let remove_comment = '\n' + get_template('remove_comment') + '\n';
	
	admin = admin.replace('title_blank', 'article');
	user = user.replace('title_blank', 'article');
		 
	admin_body += reloc;
	admin_body = replace(admin_body, 'bracket_blank', 'back');
	admin_body = replace(admin_body, 'location_blank', 'http://127.0.0.1:80' + get_back(url_path));
	admin_body = replace(admin_body, 'name_blank', '<-');
		
	user_body += reloc;
	user_body = replace(user_body, 'bracket_blank', 'back');
	user_body = replace(user_body, 'location_blank', 'http://127.0.0.1:80' + get_back(url_path));
	user_body = replace(user_body, 'name_blank', '<-');
	
	admin_body += ln + divider + divider + ln + 'article : ' + get_front(url_path);
	admin_body += ln + 'owner : ' + info.owner;
	
	user_body += ln + divider + divider + ln + 'article : ' + get_front(url_path);
	user_body += ln + 'owner : ' + info.owner;
	
	admin_body += ln + reloc;
	admin_body = replace(admin_body, 'bracket_blank', 'comment');
	admin_body = replace(admin_body, 'location_blank', 'http://127.0.0.1:80/extern/add_comment.html?location=' + url_path);
	admin_body = replace(admin_body, 'name_blank', 'comment');
		
	user_body += ln + reloc;
	user_body = replace(user_body, 'bracket_blank', 'comment');
	user_body = replace(user_body, 'location_blank', 'http://127.0.0.1:80/extern/add_comment.html?location=' + url_path);
	user_body = replace(user_body, 'name_blank', 'comment');
	
	admin_body += action + remove_article;
	admin_body = replace(admin_body, 'bracket_blank', get_front(url_path));
	admin_body = replace(admin_body, 'name_blank', 'remove');
	
	admin_body += ln + info.text + ln + divider;
	
	user_body += ln + info.text + ln + divider;
										
	for (let i = 1; i <= info.count; i++) {
		let comment = JSON.parse(fm.read_file(location + '/' + i + '.json'));
		
		admin_body += divider + ln + 'owner : ' + comment.owner; 
		admin_body += ln + action + remove_comment;
		admin_body = replace(admin_body, 'bracket_blank', i);
		admin_body = replace(admin_body, 'name_blank', 'remove');
		admin_body += ln + comment.text + ln;
		
		user_body += divider + ln + 'owner : ' + comment.owner; 
		user_body += ln + comment.text + ln;
	};
	
	admin = admin.replace('body_blank', admin_body);
	user = user.replace('body_blank', user_body);
		
	fm.write_file(location + '/admin.html', admin);
	fm.write_file(location + '/user.html', user);
}

generate('../topics');
generate('../topics/test_topic');
generate('../topics/test_topic/test_article');

module.exports.generate = generate;
