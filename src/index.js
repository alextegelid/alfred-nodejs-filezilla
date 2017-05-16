// Note that this script must be provided to node through a so-called heredoc format. This means that the script will be executed by the bash interpreter, but it'll call node with this code as stdin.
// This is a kind of workaround to get Alfred to run a node script.
// 
// eg.
// /usr/local/bin/node <<-'JSCODE'

const fs = require('fs');
const os = require('os');

// Define the path and name regexes
const nameRegex = /<Name>(.*)<\/Name>/g;
const folderBeginRegex = /<Folder expanded="[\d]+">(.*)</g;
const folderEndRegex = /<\/Folder>/g;

let pathParts = [];
let sites = [];

fs.readFile(os.homedir()+'/.config/filezilla/sitemanager.xml', 'utf8', (err, data) => {
	if (err) {
		throw err;
	}
	
	const lines = data.split('\n');
	
	lines.forEach((line) => {
		checkFolderBegin(line);
		checkFolderEnd(line);
		checkSiteName(line);
	});
	
	printXML();
});

function checkFolderBegin(line) {
	let match = folderBeginRegex.exec(line);
	if (match && match.length > 0) {
		pathParts.push(match[1]);
	}
}

function checkFolderEnd(line) {
	let match = folderEndRegex.exec(line);
	if (match && match.length > 0) {
		pathParts.pop();
	}
}

function checkSiteName(line) {
	let match = nameRegex.exec(line);
	if (match && match.length > 0) {
		
		let name = match[1];
		let path = (pathParts.length) ? pathParts.join('/') + '/' + match[1] : match[1];
		
		if (path.match(/{query}/i)) {
			sites.push({
				name: name,
				path: path
			});
		}
	}
}

function printXML() {
	process.stdout.write('<?xml version="1.0"?>\n');
	process.stdout.write('<items>\n');
	
	sites.forEach(line => {
		process.stdout.write(`<item uid='${line.path}' arg='${line.path}' valid='YES' autocomplete='${line.path}'>` + '\n');
		process.stdout.write(`    <title>${line.name}</title>` + '\n');
		process.stdout.write(`    <subtitle>Open '${line.name}' in Filezilla</subtitle>` + '\n');
		process.stdout.write(`    <icon type='fileicon'>/Applications/Filezilla.app</icon> ` + '\n');
		process.stdout.write(`</item>` + '\n');
	});
	
	process.stdout.write('<items>');
}

// The end of the heredoc format must be included in the end of the script.
// 
// eg.
// JSCODE
