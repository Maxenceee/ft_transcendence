import { Component, createElement, Loader, useParams, navigate } from '..';
				
import TwoFourGameRender from './render/TwoFourGameRender';
import TournamentGameRender from './render/TournamentGameRender';
import EndGameRecap from './EndGameRecap';
import GamePlayersOverlay from './GamePlayersOverlay';
import KeyBindsView from './KeyBindsView';
import TournamentBracketOverlay from './TournamentBracketOverlay';

class GameView extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: true, game_render: null, type: "", players: null, bracketData: null, endGameData: null };

		this.setplayers = this.setplayers.bind(this);
		this.endGame = this.endGame.bind(this);
		this.finishGame = this.finishGame.bind(this);
		this.newGame = this.newGame.bind(this);
		this.updateBracket = this.updateBracket.bind(this);
	}

	componentDidMount() {
		let a = useParams("/game/:type") ?? {params: {type: null}},
			{ type } = a.params;
		if (!type) {
			navigate("/");
		}
		this.newGame(type);
	}

	componentDidUpdate() {
		if (this.state.game_render) {
			this.state.game_render.animationid() && cancelAnimationFrame(this.state.game_render.animationid());
			this.state.game_render.start(this.state);
		}
	}

	componentWillUnmount() {
		this.state.game_render && this.state.game_render.unmount();
		window.onbeforeunload = null;
	}

	setplayers(data) {
		this.setState({players: data});
	}

	updateBracket(data) {
		this.setState({bracketData: data});
	}

	endGame() {
		navigate("/")
		this.props.reload();
	}

	finishGame(data) {
		this.state.game_render && this.state.game_render.unmount();
		window.onbeforeunload = null;
		this.setState({endGameData: data.players});
	}

	newGame(type) {
		this.state.game_render && this.state.game_render.unmount();
		this.setState({loading: true, game_render: null, type: type, players: null, endGameData: null, bracketData: null});
		window.onbeforeunload = (e) => {
			e.preventDefault();
			return "Quitter cette page vous fera perdre cette partie.\nÊtes-vous sûr de vouloir quitter ?";
		}
		let onload = () => this.setState({loading: false});

		if (type == "tournament") {
			this.setState({game_render: TournamentGameRender(null, onload, this.endGame, this.finishGame, this.setplayers, this.updateBracket, {width: window.innerWidth, height: window.innerHeight})});
		} else {
			this.setState({game_render: TwoFourGameRender(type, onload, this.endGame, this.finishGame, this.setplayers, {width: window.innerWidth, height: window.innerHeight})});
		}
	}

	render() {
		return (
			this.state.loading ?
			createElement(Loader)
			:
			createElement('div', {
				class: "render-context", children: [
					!this.state.endGameData && createElement('div', {
						class: "back-button", onclick: this.endGame, children: "Quitter"
					}),
					this.state.players && createElement(GamePlayersOverlay, {players: this.state.players}),
					createElement(KeyBindsView, {type: this.state.type}),
					(this.state.type == "tournament" && this.state.bracketData) && createElement(TournamentBracketOverlay, {data: this.state.bracketData}),
					this.state.game_render && this.state.game_render.render(),
					this.state.endGameData && createElement(EndGameRecap, {data: this.state.endGameData, newGame: this.newGame, endGame: this.endGame, type: this.state.type})
				]
			})
		)
	}
}

export default GameView;