import { Component, createElement } from '../..';

class UserPagePlayerHistory extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
		// console.log(this.state);
	}
	
	componentDidUpdate() {
		// console.log("this.componentDidUpdate");
	}

	render() {
		return createElement('div', {children: [
			createElement('div', {
				class: "history-card-content", children: (
					(this.state.user.game_history && this.state.user.game_history.length) ?
					this.state.user.game_history.sort((a, b) => a.date > b.date ? -1 : 1).map(game => {
						let p = game.data.sort((a, b) => a.score > b.score ? -1 : 1)[0].id == this.state.user.id;
						let s = game.data.sort((_, b) => b.id == this.state.user.id ? 1 : -1);
						if (game.type === "2p") {
							return createElement('div', {
								class: "history-row", children: [
									(
										p ?
										createElement('div', {
											class: "win", children: "Victory"
										})
										:
										createElement('div', {
											class: "lost", children: "Defeat"
										})
									),
									createElement('div', {
										class: "note score", children: "".concat(s[0].score, " - ", s[1].score)
									}),
									createElement('div', {
										class: "type", children: "Normal"
									})
								]
							})
						} else {
							return createElement('div', {
								class: "history-row", children: [
									(
										p ?
										createElement('div', {
											class: "win", children: "Victory"
										})
										:
										createElement('div', {
											class: "lost", children: "Defeat"
										})
									),
									createElement('div', {
										class: "type", children: "4 Players"
									})
								]
							})
						}
					})
					:
					createElement('div', {children:
						createElement('p', {children: "No game played yet", style: "text-align: center; margin-bottom: 10px;"})
					})
				)
			})
		]})
	}
}

export default UserPagePlayerHistory;