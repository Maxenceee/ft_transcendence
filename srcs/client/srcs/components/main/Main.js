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
		// this.loadUser();
		this.setState({ loading: false, user: {
			"id": "hj10QnsdUi",
			"nickname": "Max",
			"is_online": false,
			"profile_picture": "https://cdn.maxencegama.dev/placeholder/u/pl/static/profile/2023-03-01-23-34-51.png",
			"following": [
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
				{
					"id": "S2u0kgbPSC",
					"nickname": "mgama",
					"is_online": false,
					"profile_picture": "https://cdn.intra.42.fr/users/9b1753f3d477f8847544d53b89003586/medium_mgama.jpg"
				},
			],
			"game_history": [
				{
					"id": 1,
					"date": 1711405447,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 0
						},
						{
							"id": "hj10QnsdUi",
							"score": 3
						}
					]
				},
				{
					"id": 2,
					"date": 1711405993,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 3
						},
						{
							"id": "hj10QnsdUi",
							"score": 5
						}
					]
				},
				{
					"id": 3,
					"date": 1711406177,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 0
						},
						{
							"id": "hj10QnsdUi",
							"score": 3
						}
					]
				},
				{
					"id": 4,
					"date": 1711406237,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 1
						},
						{
							"id": "hj10QnsdUi",
							"score": 0
						}
					]
				},
				{
					"id": 5,
					"date": 1711406469,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 5
						},
						{
							"id": "hj10QnsdUi",
							"score": 1
						}
					]
				},
				{
					"id": 6,
					"date": 1711410695,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 0
						},
						{
							"id": "hj10QnsdUi",
							"score": 3
						}
					]
				},
				{
					"id": 7,
					"date": 1711410747,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 1
						},
						{
							"id": "hj10QnsdUi",
							"score": 0
						}
					]
				},
				{
					"id": 8,
					"date": 1711410801,
					"type": "2p",
					"data": [
						{
							"id": "hj10QnsdUi",
							"score": 0
						},
						{
							"id": "QivsUeI4kS",
							"score": 3
						}
					]
				},
				{
					"id": 9,
					"date": 1711410905,
					"type": "2p",
					"data": [
						{
							"id": "QivsUeI4kS",
							"score": 5
						},
						{
							"id": "hj10QnsdUi",
							"score": 3
						}
					]
				}
			]
		}});
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