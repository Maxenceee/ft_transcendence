import { Component, createElement, Loader, useParams, navigate } from '..';

class TournamentBracketOverlay extends Component {
	playground(player_1 = {}, player_2 = {}) {
		return createElement('div', {
			class: "bracket-playground", children: [
				createElement('p', {
					class: "playground-player", children: player_1.nickname || "", title: player_1.nickname || ""
				}),
				createElement('div', {
					class: "playground-separator"
				}),
				createElement('p', {
					class: "playground-player", children: player_2.nickname || "", title: player_2.nickname || ""
				}),
			]
		})
	}
	
	render() {
		let data = (function(listeObjets) {
			const groupes = {};
			listeObjets.forEach(objet => {
				if (groupes.hasOwnProperty(objet.gameNumber)) {
					groupes[objet.gameNumber].push(objet);
				} else {
					groupes[objet.gameNumber] = [objet];
				}
			});
			for (let i = 1; i <= 7; i++) {
				if (!groupes.hasOwnProperty(i)) {
					groupes[i] = [];
				}
			}
			return Object.values(groupes);
		})(this.props.data || []);

		return createElement('div', {
			class: "bracket-overlay", children: createElement('div', {
				class: "bracket-overlay-cnt", children: [
					createElement('div', {
						class: "", children: this.playground(...(data[6] || []))
					}),
					createElement('div', {
						class: "flex flex-row gap-30 bracket-link", children: [
							createElement('div', {
								class: "flex flex-column items-center gap-30", children: [
									createElement('div', {
										class: "", children: this.playground(...(data[5] || []))
									}),
									createElement('div', {
										class: "flex flex-row gap-30 bracket-link", children: [
											createElement('div', {
												class: "", children: this.playground(...(data[3] || []))
											}),
											createElement('div', {
												class: "", children: this.playground(...(data[2] || []))
											})
										]
									})
								]
							}),
							createElement('div', {
								class: "flex flex-column items-center gap-30", children: [
									createElement('div', {
										class: "", children: this.playground(...(data[4] || []))
									}),
									createElement('div', {
										class: "flex flex-row gap-30 bracket-link", children: [
											createElement('div', {
												class: "", children: this.playground(...(data[1] || []))
											}),
											createElement('div', {
												class: "", children: this.playground(...(data[0] || []))
											})
										]
									})
								]
							})
						]
					})
				]
			})
		})
	}
}

export default TournamentBracketOverlay;