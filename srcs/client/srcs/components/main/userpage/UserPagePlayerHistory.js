import { Component, createElement, link } from '../..';

class UserPagePlayerHistory extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		// let getTypeTitle = (type) => {
		// 	switch(type) {
		// 		case "2p":
		// 			return "Normale";
		// 		case "4p":
		// 			return "4 Joueurs";
		// 		case "ai":
		// 			return "Partie contre IA";
		// 		case "local":
		// 			return "Locale";
		// 		case "tournament":
		// 			return "Tournoi";
		// 	}
		// }

		return createElement('div', {children: [
			createElement('div', {
				class: "history-card-content", children: (
					(this.props.data && this.props.data.length) ?
					this.props.data.sort((a, b) => a.date > b.date ? -1 : 1).map(game => {
						let p = game.data.sort((a, b) => a.score > b.score ? -1 : 1)[0].id == this.props.id;
						let s = game.data.sort((_, b) => b.id == this.props.id ? 1 : -1);
						console.log(p, s);
						return createElement('div', {
							class: "history-row", children: [
								(
									p ?
									createElement('div', {
										class: "win", children: "Victoire"
									})
									:
									createElement('div', {
										class: "lost", children: "Défaite"
									})
								),
								(game.type != "4p" && game.type != "tournament") && createElement('div', {
									class: "note score", children: "".concat(s[0].score, " - ", s[1].score)
								}),
								createElement('div', {
									class: "type", children: link({to: "/user/"+s[1].id, children: s[1].nickname || "N/A"})
								})
							]
						})
					})
					:
					createElement('div', {children:
						createElement('p', {children: "Aucune parties jouées", style: "text-align: center; margin-bottom: 10px;"})
					})
				)
			})
		]})
	}
}

export default UserPagePlayerHistory;