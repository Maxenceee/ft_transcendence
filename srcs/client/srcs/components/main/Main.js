import { Component, createElement, BrowserRouter, MainRouter, GameView, router, route, xhr, Loader, BadConnection } from '..';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = { user: null, loading: true, error: null, socket: null};
	}

	// connectSocket() {
	// 	let socket = new Socket({path: "/user"});
	// 	socket.onconnection(() => {
	// 		console.info("Connection opened");
	// 	});
	// 	socket.onclose(() => {
	// 		console.info("Connection closed");
	// 	});
	// 	socket.onmessage((msg) => {
	// 		console.log(msg);
	// 	});
	// 	this.setState({socket: socket});
	// }

	loadUser(callBack = null) {
		xhr.get('/api/user/me/get')
		.then(res => res.data)
		.then(data => {
			console.log("data", data);
			this.setState({ user: data, loading: false }, callBack);
			// this.connectSocket();
		})
		.catch(error => {
			console.error("error", error);
			this.setState({ loading: false, error: "An error occured" });
		})
	}

	reload() {
		this.setState({ loading: true });
	}

	componentDidMount() {
		// console.log("==================== Main mounted ====================");
		/**
		 * TODO: remove setTimeout
		 */
		this.loadUser();
		// this.setState({ loading: false, user: {}});
	}

	componentDidUpdate() {
		// console.log("==================== Main updated ====================");
	}

	componentWillUnmount() {
		// console.log("==================== Main unmounted ====================");
		// this.state.socket.close();
	}

	render() {
		return (
			this.state.loading ?
			createElement(Loader)
			:
			this.state.error != null ?
			createElement(BadConnection)
			:
			createElement(BrowserRouter, {children:
				router(
					route({path: "/game/:type", element: createElement(GameView, {reload: this.loadUser.bind(this)})}),
					route({path: "/*", element: createElement(MainRouter, {user: this.state.user, reload: this.loadUser.bind(this)})}),
				)
			})
		)
	}
}

export default Main;