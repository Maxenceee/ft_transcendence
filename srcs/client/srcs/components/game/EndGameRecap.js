import { Component, createElement, link } from "..";

class EndGameRecap extends Component {
	button(text, to, reverse = false) {
		return createElement('div', {
			class: "dg-overlay-button"+(reverse ? " invert" : ""), children: [
				link({to: to, children: createElement('p', {
					children: text
				})})
			]
		});
	}

	twoPlayers(type, players) {
		let getTypeTitle = (type) => {
			switch(type) {
				case "2p":
					return "Normale";
				case "ai":
					return "Partie contre IA";
				case "local":
					return "Partie locale";
			}
		}

		return [
			createElement('div', {
				class: "", children: [
					createElement('h1', {
						class: "dg-overlay-vs-title", children: getTypeTitle(type)
					})
				]
			}),
			createElement('div', {
				class: "dg-overlay-player-cnt", children: [
					createElement('div', {
						class: "dg-overlay-player", children: [
							createElement('h2', {
								class: "dg-overlay-player-score",
							}),
							createElement('div', {
								class: "profile-picture", children: createElement('img', {
									src: players[0].profile_picture
								}),
							}),
							createElement('h1', {
								children: players[0].nickname || "N/A",
							}),
							this.button("Voir le profil", "/user/" + players[0].id)
						]
					}),
					createElement('div', {
						class: "dg-overlay-vs", children: [
							createElement('div', {
								class: "dg-overlay-vs-scores", children: [
									createElement('h1', {
										class: "", children: players[0].score || 0
									}),
									createElement('div', {class: "separator"}),
									createElement('h1', {
										class: "", children: players[1].score || 0
									})
								]
							}),
							createElement('div', {
								class: "", children: [
									createElement('div', {
										class: "dg-overlay-button", onclick: () => this.props.newGame(this.props.type), children: [
											createElement('p', {
												children: "Rejouer"
											})
										]
									}),
									this.button("Quitter", "/", true),
								]
							}),
						]
					}),
					createElement('div', {
						class: "dg-overlay-player", children: [
							createElement('h2', {
								class: "dg-overlay-player-score",
							}),
							createElement('div', {
								class: "profile-picture", children: createElement('img', {
									src: players[1].profile_picture
								}),
							}),
							createElement('h1', {
								children: players[1].nickname || "N/A",
							}),
							this.button("Voir le profil", "/user/" + players[1].id)
						]
					}),
				]
			})
		]
	}

	fourPlayers(players) {
		return createElement('div', {
			children: [

			]
		})
	}

	render() {
		return createElement('div', {
			class: "dg-overlay", children: createElement('div', {
				class: "dg-overlay-cnt", children: (this.props.data).length == 2 ?
				this.twoPlayers(this.props.type, this.props.data)
				:
				this.fourPlayers(this.props.type, this.props.data)
			})
		});
	}
}

export default EndGameRecap;