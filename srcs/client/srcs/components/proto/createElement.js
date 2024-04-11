import { Component } from '..';

function Is(e) {
	switch (e) {
		case "math":
			return "http://www.w3.org/1998/Math/MathML";
		case "foreignObject":
			return "http://www.w3.org/1999/xhtml";
		case "svg":
		default:
			return "http://www.w3.org/2000/svg";
	}
}
/**
 * 
 * @param {string|Component} type 
 * @param {{}} props 
 * @returns {new Component|{
 * 	type: string,
 * 	_data: string,
 * 	_element: HTMLElement,
 * 	_renderComponent(),
 * 	_unmountComponent(),
 * }}
 */
function createElement(type, props = {}) {
	let t;
	if (typeof props != "object") throw new Error('`props` must be an object, not '+typeof props);
	if (typeof type === 'function') {
		return new type(props);
	} else {
		type = type.toLowerCase();
		let element = (["svg", "path", "circle", "text", "line", "g", "polygon"].includes(type) ? document.createElementNS(Is(type), type) : document.createElement(type));
		let jv = function(c) {
			if (typeof c === "function" && !(c instanceof Component))
				throw new Error('Route component must be instanciated with new keyword');

			if (c instanceof HTMLElement) {
				return element.appendChild(c), c;
			}
			if (typeof c === 'string' || typeof c === 'number') {
				element.appendChild(document.createTextNode(c + ''));
			} else {
				c && element.appendChild(c._renderComponent());
			}
		}
		Object.keys(props).forEach(key => {
			if (key === 'children') {
				const children = props[key];
				if (!children && typeof children !== "number") return;
				if (Array.isArray(children)) {
					children.forEach(child => jv(child));
				} else {
					jv(children);
				}
			} else if (key == "ref") {
				if (typeof props[key] !== "object") throw new Error('`ref` must be an object, not '+typeof props[key]);
				if (props[key].current != null) {
					element.scrollTop = props[key].current.scrollTop;
				}
				props[key].current = element;
			} else if (key.startsWith('on') && typeof props[key] === 'function') {
				element.addEventListener(key.substring(2).toLowerCase(), props[key]);
			} else {
				element.setAttribute(key, props[key]);
			}
		});
		return {
			type,
			_data: props,
			_element: element,
			get element() {
				return element;
			},
			_renderComponent() {
				return element;
			},
			_unmountComponent() {
				if (!this._data || !this._data.children) return;
				let k = e => e && typeof e === "object" && typeof e._unmountComponent === "function";
				if (Array.isArray(this._data.children)) {
					this._data.children.forEach(child => k(child) && child._unmountComponent());
				} else {
					k(this._data.children) && this._data.children._unmountComponent();
				}
			},
		};
	}
}

export default createElement;