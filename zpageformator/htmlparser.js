/*!






 __  __                                                  ____
|  \/  |   __ _  __  __   ___   _ __     ___    ___     / ___|   __ _   _ __ ___     __ _ 
| |\/| |  / _` | \ \/ /  / _ \ | '_ \   / __|  / _ \   | |  _   / _` | | '_ ` _ \   / _` |
| |  | | | (_| |  >  <  |  __/ | | | | | (__  |  __/   | |_| | | (_| | | | | | | | | (_| |
|_|  |_|  \__,_| /_/\_\  \___| |_| |_|  \___|  \___|    \____|  \__,_| |_| |_| |_|  \__,_|







 */
/**!
 *   @license © Copyright 2024, All rights reserved.
 *   @author Maxence Gama, @maxencegama
 *   @contact contact@maxencegama.dev
 */

const fs = require('fs');
const { parse } = require('node-html-parser');

function tab(level) {
	return ' '.repeat(level * 4);
}

function parseHTMLElement(node, level = 1) {
    let jsCode = '';
    
    const tagName = node.rawTagName ? node.rawTagName : '';

	let res = [];
	if (node.rawAttrs) {
		Object.keys(node.attributes).forEach(attr => {
			const value = node.attributes[attr];
			res.push(`${attr}: "${value}"`);
		});
	}

	if (tagName === 'a') {
		jsCode += `link({\n`;
		let k;
		if ((k = res.findIndex(e => e.includes('href'))) !== -1) {
			res[k] = res[k].replace('href', 'to');
		}
	} else {
		jsCode += `createElement('${tagName}', {\n`;
	}

	jsCode += tab(level);

    if (node.childNodes.length > 0) {
        let childrenCode = node.childNodes
			.filter(child => (child.nodeType === 1) || (child.nodeType === 3 && child.text.trim().length))
		
		if (childrenCode.length > 1)
			level += 1;

		childrenCode = childrenCode.map(child => {
			if (child.nodeType === 1) {
				return parseHTMLElement(child, level + 1);
			} else if (child.nodeType === 3) {
				return `"${child.text}"`;
			}
		});
		if (childrenCode.length > 1) {
			res.push(`children: [\n${tab(level)}${childrenCode.join(',\n'.concat(tab(level)))}\n${tab(level - 1)}]`);
		} else if (childrenCode.length === 1){
			res.push(`children: ${childrenCode}`);
		}
		if (childrenCode.length > 1)
			level -= 1;
    }
	jsCode += res.join(', ');

    jsCode += `\n${tab(level - 1)}})`;
    return jsCode;
}

!function(args) {
	if (args.length < 1 || args.length > 2) {
		console.log('Usage: node htmlparser.js <html>');
		console.log('Usage: node htmlparser.js -f <path-to-html-file>');
		return;
	}

	let content;
	if (args[0] === '-f') {
		if (args.length !== 2) {
			console.log('Usage: node htmlparser.js -f <path-to-html-file>');
			return;
		}
		const buffer = fs.readFileSync(args[1]);
		content = buffer.toString();
	} else {
		content = args[0];
	}

    const root = parse(content);
    const jsCode = parseHTMLElement(root.firstChild);

    console.log(jsCode);
}(process.argv.splice(2));
