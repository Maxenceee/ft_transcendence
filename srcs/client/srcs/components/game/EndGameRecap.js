import { Component, createElement, link } from "..";
import { ismax } from "../proto/Component";

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
								children: players[0].nickname || "N/A", class: ismax(players[0].id, true)
							}),
							players[0].id && this.button("Voir le profil", "/user/" + players[0].id) || createElement('div')
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
										class: "dg-overlay-button px-80", onclick: () => this.props.newGame(type), children: [
											createElement('p', {
												children: "Rejouer"
											})
										]
									}),
									createElement('div', {
										class: "dg-overlay-button invert", onclick: this.props.endGame, children: createElement('p', {
											children: "Quitter"
										})
									})
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
								children: players[1].nickname || "N/A", class: ismax(players[1].id, true)
							}),
							players[1].id && this.button("Voir le profil", "/user/" + players[1].id) || createElement('div')
						]
					}),
				]
			})
		]
	}

	fourPlayers(type, players) {
		players.sort((a, b) => b.score - a.score);
		let getGrade = (id) => {
			return (id == 1 && "1er" || id + "ème");
		};

		return [
			createElement('div', {
				class: "mb-10", children: [
					createElement('h1', {
						class: "dg-overlay-vs-title", children: "Partie à 4"
					})
				]
			}),
			createElement('div', {
				class: "dg-overlay-player-cnt podium grid", children: players.map((e, i) => {
					return createElement('div', {
						class: "dg-overlay-player", children: [
							createElement('h2', {
								class: "dg-overlay-player-score", children: getGrade(i + 1)
							}),
							createElement('div', {
								class: "profile-picture", children: createElement('img', {
									src: e.profile_picture
								}),
							}),
							createElement('h1', {
								children: e.nickname || "N/A", class: ismax(e.id, true)
							}),
							e.id && this.button("Voir le profil", "/user/" + e.id) || createElement('div')
						]
					})
				})
			}),
			createElement('div', {
				class: "", style: "display: inline-block;", children: [
					createElement('div', {
						class: "dg-overlay-button px-80", onclick: () => this.props.newGame(type), children: [
							createElement('p', {
								children: "Rejouer"
							})
						]
					}),
					createElement('div', {
						class: "dg-overlay-button invert", onclick: this.props.endGame, children: createElement('p', {
							children: "Quitter"
						})
					})
				]
			}),
		]
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