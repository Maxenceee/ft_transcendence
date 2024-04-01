import { Component, createElement } from "..";

class EndGameRecap extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log("EndGameRecap", this.props);
		return createElement('div', {
			class: "dg-overlay", children: this.props && this.props.data.sort((a, b) => a.score < b.score ? -1 : 1).map((player, i) => {
				return player.id;
			}),
		});
	}
}

export default EndGameRecap;