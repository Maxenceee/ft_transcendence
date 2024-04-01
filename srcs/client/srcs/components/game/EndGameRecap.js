import { Component, createElement } from "..";

class EndGameRecap extends Component {
	constructor(props) {
		super(props);
	}

	twoPlayers() {
		return [
			createElement('div', {
				class: "dg-overlay-player", children: [
					createElement('h1', {
						children: this.state.players[0].nickname,
					}),
					createElement('img', {
						src: this.state.players[0].profile_picture
					}),
				]
			}),
			createElement('div', {
				
			}),
			createElement('div', {
				class: "dg-overlay-player", 
			}),
		]
	}

	fourPlayers() {

	}

	render() {
		return createElement('div', {
			class: "dg-overlay", children: createElement('div', {
				class: "dg-overlay-cnt", children: this.props.data.length == 2 ?
				this.twoPlayers()
				:
				this.fourPlayers()
			})
		});
	}
	// children: this.props && this.props.data.sort((a, b) => a.score < b.score ? -1 : 1).map((player, i) => {
	// 	return player.id;
	// }),
}

export default EndGameRecap;