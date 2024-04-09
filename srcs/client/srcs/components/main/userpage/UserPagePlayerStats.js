import { Component, createElement } from '../..';

class UserPagePlayerStats extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
	}

	isWinner(data) {
		data = data.map(e => {
			let p = e.data.sort((a, b) => a.score < b.score ? 1 : -1);
			return p[0].id == this.state.user.id;
		});
		return data;
	}

	getWinRate(data) {
		let n = data.length && this.isWinner(data.filter(e => e.type === "2p")) || [];
		let f = data.length && this.isWinner(data.filter(e => e.type === "4p")) || [];
		let t = data.length && this.isWinner(data.filter(e => e.type === "tournament")) || [];
		return ({
			normal: {
				total: n.length,
				wr: n.length > 0 ? ((n.filter(e => e).length / n.length) * 100).toFixed(0)+"%" : "aucun",
			},
			four: {
				total: f.length,
				wr: f.length > 0 ? ((f.filter(e => e).length / f.length) * 100).toFixed(0)+"%" : "aucun",
			},
			tournament: {
				total: t.length,
				wr: t.length > 0 ? ((t.filter(e => e).length / t.length) * 100).toFixed(0)+"%" : "aucun",
			},
		})
	}

	render() {
		let data = this.getWinRate(this.state.user.game_history);
		return createElement('div', {
			class: "stat-card-content", children: [
				createElement('div', {
					class: "stat-group w-full", children: [
						createElement('h1', {
							children: "Normal"
						}),
						createElement('p', {
							class: "note", children: "<count> Jouées".replace("<count>", data.normal.total)
						}),
						createElement('p', {
							class: "note", children: "Ratio: <per>".replace("<per>", data.normal.wr)
						}),
						createElement('div', {
							class: "progress-bar", style: "--value: <per>;".replace("<per>", data.normal.wr), children: [
								createElement('div', {}), createElement('div', {})
							]
						})
					]
				}),
				createElement('div', {
					class: "stat-group w-full", children: [
						createElement('h1', {
							children: "4 Joueurs"
						}),
						createElement('p', {
							class: "note", children: "<count> Jouées".replace("<count>", data.four.total)
						}),
						createElement('p', {
							class: "note", children: "Ratio: <per>".replace("<per>", data.four.wr)
						}),
						createElement('div', {
							class: "progress-bar", style: "--value: <per>;".replace("<per>", data.four.wr), children: [
								createElement('div', {}), createElement('div', {})
							]
						})
					]
				}),
				createElement('div', {
					class: "stat-group w-full", children: [
						createElement('h1', {
							children: "Tournois"
						}),
						createElement('p', {
							class: "note", children: "<count>  Jouées".replace("<count>", data.tournament.total)
						}),
						createElement('p', {
							class: "note", children: "Ratio: <per>".replace("<per>", data.tournament.wr)
						}),
						createElement('div', {
							class: "progress-bar", style: "--value: <per>;".replace("<per>", data.tournament.wr), children: [
								createElement('div', {}), createElement('div', {})
							]
						})
					]
				})
			]
		})
	}
}

export default UserPagePlayerStats;