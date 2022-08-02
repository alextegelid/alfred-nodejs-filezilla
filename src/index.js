// Note that this script must be provided to node through a so-called heredoc format. This means that the script will be executed by the bash interpreter, but it'll call node with this code as stdin.
// This is a kind of workaround to get Alfred to run a node script.
// 
// eg.
// /usr/local/bin/node <<-'JSCODE'

const fs = require('fs');
const os = require('os');

// Define the folder and name regexes
const nameRegex = /<Name>(.*)<\/Name>/g;
const folderBeginRegex = /<Folder expanded="[\d]+">(.*)</g;
const folderEndRegex = /<\/Folder>/g;
const searchQueryRegex = /{query}/i;

let pathParts = [];
let sites = [];

/**
 * Read the Filezilla sitemanager.xml file line by line parsing each line for
 * folder and name tags.
 */
fs.readFile(os.homedir()+'/.config/filezilla/sitemanager.xml', 'utf8', (err, data) => {
	if (err) {
		throw err;
	}
	
	// Split the file into lines
	const lines = data.split('\n');
	
	// Iterate over the lines
	lines.forEach((line) => {
		// Check if the line contains a opening folder tag
		checkFolderBegin(line);
		// Check if the line contains a cloing folder tag
		checkFolderEnd(line);
		// Check if the line contains a name tag
		checkSiteName(line);
	});
	
	printJSON();
});

/**
 * Check if a line contains a opening folder tag
 * @param  {string} line The line to check.
 */
function checkFolderBegin(line) {
	let match = folderBeginRegex.exec(line);
	if (match && match.length > 0) {
		pathParts.push(match[1]);
	}
}

/**
 * Check if a line contains a closing folder tag
 * @param  {string} line The line to check.
 */
function checkFolderEnd(line) {
	let match = folderEndRegex.exec(line);
	if (match && match.length > 0) {
		pathParts.pop();
	}
}

/**
 * Check if a line contains a name tag
 * @param  {string} line The line to check.
 */
function checkSiteName(line) {
	let match = nameRegex.exec(line);
	if (match && match.length > 0) {
		
		let name = match[1];
		let path = (pathParts.length) ? pathParts.join('/') + '/' + match[1] : match[1];
		
		// Make sure the name matches the search query in Alfred
		if (matchesSearchQuery(name)) {
			sites.push({
				name: name,
				path: path
			});
		}
	}
}

/**
 * Match the search query in name
 * @param  {string} name The name to match on
 * @return {bool}      True if name contains the query, else false
 */
function matchesSearchQuery(name) {
	return name.match(searchQueryRegex) ? true : false;
}

function printJSON() {
	process.stdout.write('{"items": [');
	
	sites.forEach(line => {
		process.stdout.write(`{
			"uid": "${line.path}",
			"type": "file",
			"title": "${line.name}",
			"subtitle": "Open '${line.name}' in Filezilla",
			"arg": "${line.path}",
			"autocomplete": "${line.path}",
			"icon": {
				"type": "fileicon",
				"path": "/Applications/Filezilla.app"
			}
        },`);
	});
	
	process.stdout.write(']}');
}

// The end of the heredoc format must be included in the end of the script.
// 
// eg.
// JSCODE
