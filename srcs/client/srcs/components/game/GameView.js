import { Component, createElement, Loader, useParams, navigate } from '..';
				
import TwoFourGameRender from './render/TwoFourGameRender';
import TournamentGameRender from './render/TournamentGameRender';
import EndGameRecap from './EndGameRecap';
import GamePlayersOverlay from './GamePlayersOverlay';
import KeyBindsView from './KeyBindsView';

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: true, game_render: null, type: "", players: null, endGameData: null };

		this.setplayers = this.setplayers.bind(this);
		this.endGame = this.endGame.bind(this);
		this.finishGame = this.finishGame.bind(this);
		this.newGame = this.newGame.bind(this);
	}

	componentDidMount() {
		// console.log("componentDidMount GameView", this);
		let a = useParams("/game/:type") ?? {params: {type: null}},
			{ type } = a.params;
		if (!type) {
			navigate("/");
		}
		this.newGame(type);
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
		// console.log(data);
		this.setState({endGameData: data.players});
	}

	newGame(type) {
		this.state.game_render && this.state.game_render.unmount();
		this.setState({loading: true, game_render: null, type: type, players: null, endGameData: null});
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

	render() {
		// console.log("======================== GameView render ========================", this.state);
		return (
			this.state.loading ?
			createElement(Loader)
			:
			createElement('div', {
				class: "render-context", children: [
					!this.state.endGameData && createElement('div', {
						class: "back-button", onclick: () => this.endGame(), children: "Quitter"
					}),
					this.state.players && createElement(GamePlayersOverlay, {players: this.state.players}),
					createElement(KeyBindsView, {type: this.state.type}),
					this.state.game_render && this.state.game_render.render(),
					this.state.endGameData && createElement(EndGameRecap, {data: this.state.endGameData, newGame: this.newGame, type: this.state.type})
					// createElement(EndGameRecap, {type: this.state.type, data: [
					// 	{id: "3", score: 0, nickname: "Marvin", profile_picture: "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=9856120325"},
					// 	{id: "maxence", score: 5, nickname: "Max", profile_picture: "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=7516293836"},
					// 	// {id: "2", score: 0, nickname: "Marvin", profile_picture: "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=9856120325"},
					// 	// {id: "4", score: 0, nickname: "Marvin", profile_picture: "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=9856120325"}
					// ]})
				]
			})
		)
	}
}

export default GameView;