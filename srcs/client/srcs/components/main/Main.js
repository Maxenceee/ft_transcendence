import { Component, createElement, BrowserRouter, MainRouter, GameView, router, route, Loader, BadConnection, ServerError, TeaPot, Socket, AlertBanner } from '..';
import axios from "axios";

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = { user: null, loading: true, error: null, socket: null };
	}

	connectSocket() {
		let socket = new Socket({path: "/user"});
		socket.onconnection(() => {
			console.info("Connection opened");
		});
		socket.onclose(() => {
			console.info("Connection closed");
		});
		this.setState({socket: socket});
	}

	loadUser(callBack = null, loading = true) {
		if (loading) {
			this.setState({ loading: true });
		}
		axios.get('/api/user/me/get')
		.then(res => res.data)
		.then(data => {
			this.setState({ user: data, loading: false }, callBack);
		})
		.catch(error => {
			this.setState({ loading: false, error: "Une erreur s'est produite, veuillez réessayer plus tard." });
		})
	}

	componentDidMount() {
		this.loadUser();
		this.connectSocket();
	}

	componentWillUnmount() {
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
					route({path: "/game/:type", element: createElement(GameView, {reload: this.loadUser.bind(this)})}),
					route({path: "/500", element: createElement(ServerError)}),
					route({path: "/418", element: createElement(TeaPot)}),
					route({path: "/*", element: createElement(MainRouter, {user: this.state.user, reload: this.loadUser.bind(this)})}),
				)
			})
		)
	}
}

export default Main;