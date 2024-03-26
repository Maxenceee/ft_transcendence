import { Component, createElement } from '..';

class Route extends Component {
	constructor(props) {
		super(props);
		if (props.path === void 0 || !props.path.length) throw new Error('Route must have a `path` property');
		if (props.element === void 0) throw new Error('Route must have an `element` property');
		if (typeof props.element === "object" && Array.isArray(props.element))
			throw new Error('Route component cannot be an array');

		this.path = props.path.replace(/^\/*/, "/");
		this.active = false;
	}

	// get element() {
	// 	return this._data && this._data._element || this._element;
	// }

	// set element(e) {
	// 	this._data && (this._element = e);
	// }

	canRoute(route) {
		const regex = useRoute(this.path, route);
		// console.log("regex result on route", this, regex);
		return regex;
	}

	propagateUnmount() {
		console.log("propagateUnmount from route", this);
		this.active = false;
		this._data && this._data._unmountComponent();
	}

	render() {
		const { element } = this.props;

		this._data = element;
		// console.log("in render route", this, this._element);
		return this._data;
	}
}

/**
 * 
 * @param {{
* 	path: string,
* 	element: HTMLElement|Component|String,
* }} 
* @returns {new Route}
*/
function route({ path, element }) {
   return createElement(Route, { path, element });
}

export default Route;

export { route };