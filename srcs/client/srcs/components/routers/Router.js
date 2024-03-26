import { Component, createElement, R, S, Route } from '..';

class Router extends Component {
	// TODO: see hh() in react-router
	// see useContext qnd useMemo qnd how pop nqvigation is saved and params extracted
	constructor(props) {
		super(props);
		if (!props.children || !Array.isArray(props.children)) throw new Error('Router must have children');
		if (!props.children.every(child => child instanceof Route)) throw new Error('Router children must be Route components');

		this.state = { route: S.location.pathname };
		// this.currentRoute = {route: null, params: null};
		// this.event = this.event.bind(this);
		R.register(this);
	}

	// event() {
	// 	console.log("i caught it first!!!!!!!!!!!!!!!!!!!!!", this);
	// 	const newRoute = window.location.pathname;
	// 	if (newRoute !== this.previousRoute) {
	// 		this.setState({ route: newRoute });
	// 		this.previousRoute = newRoute;
	// 	}
	// }

	componentDidMount() {
		console.log("====== Router Mounted ======", this);
	}

	componentDidUpdate() {
		console.log("====== Router Updated ======", this);
	}

	componentWillUnmount() {
		R.pop(this);
		this.props.children.forEach(child => child.propagateUnmount());
		console.log("====== Router Unmounted ======", this);
	}

	evalRoute(route) {
		// const newRoute = window.location.pathname;
		// if (newRoute !== this.state.route) {
		// 	this.setState({ route: newRoute });
		// }
		return this.props.children.some(child => child.canRoute(route));
	}

	// get element() {
	// 	return this._data && this._data._element || this._element;
	// }

	render() {
		const { children } = this.props;
		const { route } = this.state;

		// console.log("in render router", this, children, route);
		this.currentRoute = {route: null, params: null};
		let t;
		children.forEach(child => {
			if (!this.currentRoute.route && (t = child.canRoute(route)) !== null) {
				this.currentRoute.route = child;
				this.currentRoute.route.active = true;
				this.currentRoute.params = t.params;
			} else {
				if (child.active) {
					child.propagateUnmount();
				}
			}
		});
		// console.log("currentRoute", currentRoute);
		// if (currentRoute.route !== null) {
		// 	currentRoute.route.active = true;
		// 	this._element = currentRoute.route;
		// } else {
		// 	this._element = null;
		// });
		return (this.currentRoute.route || null);
	}
}

/**
 * 
 * @param  {...route} routes 
 * @returns {new Router}
 * 
 */
function router(...routes) {
	return createElement(Router, { children: routes });
}

export default Router;

export { router };