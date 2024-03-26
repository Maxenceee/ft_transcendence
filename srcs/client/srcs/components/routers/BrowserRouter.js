import { Component, R, S } from '..';

class BrowserRouter extends Component {
	constructor(props) {
		super(props);

		this.event = this.event.bind(this);
	}

	event() {
		// console.log("i caught it first!!!!!!!!!!!!!!!!!!!!!", this);
		// const newRoute = window.location.pathname
		// console.log(S.location.pathname, R.routers);
		for (let router of R.routers) {
			// console.log(router, router.evalRoute(S.location.pathname));
			if (router.evalRoute(S.location.pathname)) {
				router.setState({ route: S.location.pathname });
				break; 
			}
		}
	}

	componentDidMount() {
		window.addEventListener('popstate', this.event);
		console.log("====== BrowserRouter Mounted ======", this);
	}

	componentWillUnmount() {
		window.removeEventListener('popstate', this.event);
		console.log("====== BrowserRouter Unmounted ======", this);
	}

	// get element() {
	// 	return this._data && this._data._element || this._element;
	// }

	render() {
		console.log("in render BrowserRouter", this);
		return this.props.children;
	}
}

export default BrowserRouter;