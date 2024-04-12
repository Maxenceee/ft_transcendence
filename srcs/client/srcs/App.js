import { createElement, Component, Main } from './components';
import axios from "axios";

let renderer = function() {
	this._internalRoot = root;
}
renderer.prototype.render = function(elem) {
	if (typeof elem !== "object" || (typeof elem.render !== "function" && typeof elem._renderComponent !== "function"))
		throw new TypeError('Cannot mount invalid element');
	this._children = elem;
	if (this._internalRoot === null) throw Error('Unable to find root node');
	let element = this._children._renderComponent();
	if (element == undefined) throw new Error('Cannot mount invalid element');
	if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
        document.body.classList.add('chrome');
    }
	this._internalRoot.appendChild(element);
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

axios.defaults.baseURL = (process.env.BASE_URI || "");

App.createRoot(document.getElementById('root')).render(createElement(Main));