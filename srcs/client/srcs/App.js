import { createElement, Component, xhr, Main } from './components';

let renderer = function() {
	this._internalRoot = root;
}
renderer.prototype.render = function(elem) {
	if (typeof elem !== "object" || (typeof elem.render !== "function" && typeof elem._renderComponent !== "function"))
		throw new TypeError('Cannot mount invalid element');
	this._children = elem;
	// console.log(elem);
	if (this._internalRoot === null) throw Error('Unable to find root node');
	let element = this._children._renderComponent();
	if (element == undefined) throw new Error('Cannot mount invalid element');
	console.log("root element", element, this);
	if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
        document.body.classList.add('chrome');
    }
	this._internalRoot.appendChild(element);
}

function setParentToComponents(obj) {
	const stack = [obj]; 
	const visited = new Set();

	while (stack.length > 0) {
		const current = stack.pop();

		if (current instanceof Component) {
			if (stack.length > 0) {
				const parent = stack[stack.length - 1];
				current.setParent(parent);
			}
		}

		for (const key in current) {
			if (current.hasOwnProperty(key)) {
				const child = current[key];
				if (typeof child === 'object' && child !== null && !visited.has(child)) {
					stack.push(child);
					visited.add(child);
				}
			}
		}
	}
}

const App = {
	createRoot: function(t) {
		while (t.firstChild) {
			t.removeChild(t.firstChild);
		}
		return (
			new renderer(t)
		);
	},
}

// xhr.defaults.baseURL = (window.location.hostname == "localhost" ? "http://localhost:3000" : "");

App.createRoot(document.getElementById('root')).render(createElement(Main));