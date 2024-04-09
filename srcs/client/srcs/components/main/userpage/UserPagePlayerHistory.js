import { Component, createElement, link } from '../..';
import { ismax } from '../../proto/Component';

class UserPagePlayerHistory extends Component {
	render() {
		return createElement('div', {children: [
			createElement('div', {
				class: "history-card-content", children: (
					(this.props.data && this.props.data.length) ?
					this.props.data.sort((a, b) => a.date - b.date).map(game => {
						let p = game.data.sort((a, b) => b.score - a.score);
						let s = [...game.data].sort((_, b) => b.id == this.props.user_id ? 1 : -1);
						return createElement('div', {
							class: "history-row", children: [
								(
									p[0].id == this.props.user_id ?
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
									class: "type lined-hover", children: game.type == "2p" ? link({to: "/user/"+s[1].id, children: s[1].nickname || "N/A", class: ismax(p[0].id)}) : link({to: "/user/"+p[0].id, children: p[0].nickname || "N/A", class: ismax(p[0].id)}), title: p[0].nickname || "N/A"
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