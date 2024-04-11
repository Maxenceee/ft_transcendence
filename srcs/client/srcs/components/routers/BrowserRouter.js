import { Component, R, S } from '..';

class BrowserRouter extends Component {
	constructor(props) {
		super(props);

		this.event = this.event.bind(this);
	}

	event(ev) {
		S.location.pathname = window.location.pathname;
		for (let router of R.routers) {
			if (router.evalRoute(S.location.pathname)) {
				router.setState({ route: S.location.pathname });
				break; 
			}
		}
	}

	componentDidMount() {
		window.addEventListener('popstate', this.event);
	}

	componentWillUnmount() {
		window.removeEventListener('popstate', this.event);
	}

	render() {
		return this.props.children;
	}
}

export default BrowserRouter;