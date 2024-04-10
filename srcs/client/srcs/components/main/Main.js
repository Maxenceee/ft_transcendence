import { Component, createElement, BrowserRouter, MainRouter, GameView, router, route, Loader, BadConnection, ServerError, TeaPot, Socket, AlertBanner, ConnectionPage, Cookies } from '..';
import axios from "axios";

class MainView extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: true, error: null, socket: null};
	}

	connectSocket() {
		let socket = new Socket({path: "/user"});
		socket.onconnection(() => {
			console.info("Connection opened");
		});
		socket.onclose(() => {
			console.info("Connection closed");
		});
		socket.onmessage((msg) => {
			console.log(msg);
		});
		this.setState({socket: socket});
	}

	componentDidMount() {
		// console.log("==================== Main mounted ====================");
		this.connectSocket();
	}

	componentDidUpdate() {
		// console.log("==================== Main updated ====================");
	}

	componentWillUnmount() {
		// console.log("==================== Main unmounted ====================");
		this.state.socket.close();
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
					route({path: "/game/:type", element: createElement(GameView, {reload: this.props.reload})}),
					route({path: "/500", element: createElement(ServerError)}),
					route({path: "/418", element: createElement(TeaPot)}),
					route({path: "/*", element: createElement(MainRouter, {user: this.props.user, reload: this.props.reload})}),
				)
			})
		)
	}
}

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = { user: null, connected: false };

		this.loadUser = this.loadUser.bind(this);
	}

	componentDidMount() {
		if (!Cookies.get('token').length) {
			return this.setState({ connected: false });
		}
		this.loadUser();
	}

	// componentDidUpdate() {
	// 	if (!Cookies.get('token').length) {
	// 		return this.setState({ connected: false });
	// 	}
	// }

	loadUser(callBack = null, loading = true) {
		if (loading) {
			this.setState({ loading: true });
		}
		axios.get('/api/user/me/get')
		.then(res => res.data)
		.then(data => {
			if (data.missingAuth) {
				return this.setState({ connected: false, loading: false, user: null });
			}
			this.setState({ user: data, loading: false, connected: true }, callBack);
		})
		.catch(error => {
			// console.error("error", error);
			this.setState({ loading: false, error: "Une erreur s'est produite, veuillez réessayer plus tard." });
		})
	}

	render() {
		return (
			!this.state.connected ?
			createElement(ConnectionPage, {reload: this.loadUser})
			:
			createElement(MainView, {user: this.state.user, reload: this.loadUser})
		)
	}
}

export default Main;