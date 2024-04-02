import { Component, createElement, Loader, useParams, navigate } from '..';
				
import TwoFourGameRender from './render/TwoFourGameRender';
import TournamentGameRender from './render/TournamentGameRender';
import EndGameRecap from './EndGameRecap';


class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: true, game_render: null, type: "", players: null, endGameData: null };

		this.setplayers = this.setplayers.bind(this);
		this.endGame = this.endGame.bind(this);
		this.finishGame = this.finishGame.bind(this);
	}

	componentDidMount() {
		console.log("componentDidMount GameView", this);
		let a = useParams("/game/:type") ?? {params: {type: null}},
			{ type } = a.params;
		if (!type) {
			navigate("/");
		}
		this.setState({loading: true, game_render: null, type: type});
		window.onbeforeunload = (e) => {
			// display a message to the user
			e.preventDefault();
			return "Quitting this page will stop the game and you will lose the game.\nAre you sure you want to quit?";
		}
		let onload = () => this.setState({loading: false});

		if (type == "tournament") {
			this.setState({game_render: TournamentGameRender(null, onload, this.endGame, this.finishGame, this.setplayers, {width: window.innerWidth, height: window.innerHeight})});
		} else {
			this.setState({game_render: TwoFourGameRender(type, onload, this.endGame, this.finishGame, this.setplayers, {width: window.innerWidth, height: window.innerHeight})});
		}
	}

	componentDidUpdate() {
		// console.log("componentDidUpdate GameView", this.state.game_render);
		if (this.state.game_render) {
			this.state.game_render.animationid() && cancelAnimationFrame(this.state.game_render.animationid());
			this.state.game_render.start(this.state);
		}
	}

	componentWillUnmount() {
		this.state.game_render && this.state.game_render.unmount();
		window.onbeforeunload = null;
		// console.log("game view unmounted", this.state.game_render);
	}

	setplayers(data) {
		console.log("set player", data);
		this.setState({players: data});
	}

	endGame() {
		console.log("end game called", this.state.game_render);
		navigate("/");
		this.props.reload();
	}

	finishGame(data) {
		console.log("finish game", data);
		this.state.game_render && this.state.game_render.unmount();
		window.onbeforeunload = null;
		this.setState({endGameData: data.players});
	}

	render() {
		// console.log("======================== GameView render ========================", this.state);
		return (
			this.state.loading ?
			createElement(Loader)
			:
			createElement('div', {
				class: "render-context", children: [
					createElement('div', {
						class: "back-button", onclick: () => this.endGame(), children: "Quitter"
					}),
					this.state.players && this.state.type != "4p" && createElement('div', {
						class: "game-player-overlay", children: createElement('div', {
							class: "game-player-overlay-cnt", children: [
								createElement('div', {
									class: "game-player-profile", children: [
										createElement('h1', {
											children: this.state.players[0].nickname,
										}),
										createElement('img', {
											src: this.state.players[0].profile_picture
										}),
									]
								}),
								createElement('div', {
									class: "game-player-separator", children: "VS"
								}),
								createElement('div', {
									class: "game-player-profile", children: [
										createElement('img', {
											src: this.state.players[1].profile_picture
										}),
										createElement('h1', {
											children: this.state.players[1].nickname,
										}),
									]
								})
							]
						})
					}),
					createElement('div', {
						class: "game-keyboard", children: [
							createElement('div', {
								class: "game-keyboard-shortcut", children: [
									createElement('div', {
										class: "key", children: [
											"E",
											createElement('p', {
												children: "Player View"
											})
										]
									}),
									createElement('div', {
										class: "key", children: [
											"R",
											createElement('p', {
												children: "Pong View"
											})
										]
									}),
									// createElement('div', {
									// 	class: "key", children: [
									// 		"T",
									// 		createElement('p', {
									// 			children: "Top View"
									// 		})
									// 	]
									// }),
								]
							}),
							createElement('div', {
								class: "game-keyboard-moves", children: [
									createElement('div', {
										class: "key", children: [
											"↑",
											createElement('p', {
												children: "Move Up"
											})
										]
									}),
									createElement('div', {
										class: "key", children: [
											"←",
											createElement('p', {
												children: "Move Left"
											})
										]
									}),
									createElement('div', {
										class: "key", children: [
											"↓",
											createElement('p', {
												children: "Move Down"
											})
										]
									}),
									createElement('div', {
										class: "key", children: [
											"→",
											createElement('p', {
												children: "Move Right"
											})
										]
									})
								]
							}),
						]
					}),
					this.state.game_render && this.state.game_render.render(),
					this.state.endGameData && createElement(EndGameRecap, {data: this.state.endGameData})
					// createElement(EndGameRecap, {type: this.state.type, data: [{id: "maxence", score: 3, nickname: "Max", profile_picture: "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=7516293836"}, {id: "2", score: 5, nickname: "Marvin", profile_picture: "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=9856120325"}]})
				]
			})
		)
	}
}

export default GameView;