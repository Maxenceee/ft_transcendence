import { Component, createElement, useRoute } from '..';

class Route extends Component {
	constructor(props) {
		super(props);
		if (props.path === undefined || !props.path.length) throw new Error('Route must have a `path` property');
		if (props.element === undefined) throw new Error('Route must have an `element` property');
		if (typeof props.element === "object" && Array.isArray(props.element))
			throw new Error('Route component cannot be an array');

		this.path = props.path.replace(/^\/*/, "/");
		this.active = false;
	}

	canRoute(route) {
		return useRoute(this.path, route);
	}

	propagateUnmount() {
		this.active = false;
		this._data && this._data._unmountComponent();
	}

	render() {
		const { element } = this.props;

		this._data = element;
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