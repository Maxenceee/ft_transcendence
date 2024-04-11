import { Component, createElement, R, S, Route } from '..';

class Router extends Component {
	constructor(props) {
		super(props);
		if (!props.children || !Array.isArray(props.children)) throw new Error('Router must have children');
		if (!props.children.every(child => child instanceof Route)) throw new Error('Router children must be Route components');

		this.state = { route: S.location.pathname };
		R.register(this);
	}

	componentWillUnmount() {
		R.pop(this);
		this.props.children.forEach(child => child.propagateUnmount());
	}

	evalRoute(route) {
		return this.props.children.some(child => child.canRoute(route));
	}

	render() {
		const { children } = this.props;
		const { route } = this.state;

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