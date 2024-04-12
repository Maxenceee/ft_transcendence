import { Component, createElement, link } from '..';
import { ismax } from '../proto/Component';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user, reload: props.reload, scrollTop: 0 };
		this.ref = {current: null};
	}

	playButton() {
		return createElement('div', {
			class: "bc-price-btn", children: createElement('ul', {
				class: "bc-btn-transition reserv-btn", children: [
					createElement('li', {
						class: "bc-btn-transition", children: createElement('span', {
							children: "Jouer"
						})
					}),
					createElement('li', {
						class: "bc-btn-transition", children: createElement('div', {
							class: "bc-btn-transition", children: createElement('svg', {
								class: "icon bc-btn-transition", width: "40", height: "40", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
									d: "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892Z"
								})
							})
						})
					})
				]
			})
		})
	}

	render() {
		return createElement('div', {
			children: createElement('div', {
				ref: this.ref, class: "data", children: [
					createElement('section', {
						children: [
							createElement('div', {
								class: "oa-container", children: [
									createElement('div', {
										class: "section-header", children: createElement('h1', {
											children: [
												"Bonjour ", createElement('span', {
													children: this.state.user.nickname, class: ismax(this.state.user.id)
												}), ", commençons à jouer !"
											]
										})
									}),
									createElement('div', {
										class: "lobby-container page-card", children: [
											createElement('h2', {
												class: "container-title", children: "En ligne"
											}),
											createElement('div', {
												class: "fa-list", children: [
													createElement('div', {
														class: "fa-list-row", children: createElement('div', {
															class: "lobby-card", children: createElement('div', {
																class: "content", style: "background-image: url('/static/images/pong_visual_1.png');", children: createElement('div', {
																	class: "card-container", children: [
																		link({
																			to: "/game/2p", children: this.playButton()
																		}),
																		createElement('div', {
																			class: "lobby-name", children: createElement('h2', {
																				children: "Partie normale"
																			})
																		})
																	]
																})
															})
														})
													}),
													createElement('div', {
														class: "fa-list-row", children: createElement('div', {
															class: "lobby-card", children: createElement('div', {
																class: "content", style: "background-image: url('/static/images/pong_visual_3.png');", children: createElement('div', {
																	class: "card-container", children: [
																		link({
																			to: "/game/4p", children: this.playButton()
																		}),
																		createElement('div', {
																			class: "lobby-name", children: createElement('h2', {
																				children: "Partie à 4"
																			})
																		})
																	]
																})
															})
														})
													}),
													createElement('div', {
														class: "fa-list-row", children: createElement('div', {
															class: "lobby-card", children: createElement('div', {
																class: "content", style: "background-image: url('/static/images/pong_visual_11.png');", children: createElement('div', {
																	class: "card-container", children: [
																		link({
																			to: "/game/tournament", children: this.playButton()
																		}),
																		createElement('div', {
																			class: "lobby-name", children: createElement('h2', {
																				children: "Rejoindre un tournois"
																			})
																		})
																	]
																})
															})
														})
													})
												]
											})
										]
									}),
									createElement('div', {
										class: "lobby-container page-card", children: [
											createElement('h2', {
												class: "container-title", children: "Hors ligne"
											}),
											createElement('div', {
												class: "fa-list", children: [
													createElement('div', {
														class: "fa-list-row", children: createElement('div', {
															class: "lobby-card", children: createElement('div', {
																class: "content", style: "background-image: url('/static/images/pong_visual_1.png');", children: createElement('div', {
																	class: "card-container", children: [
																		link({
																			to: "/game/ai", children: this.playButton()
																		}),
																		createElement('div', {
																			class: "lobby-name", children: createElement('h2', {
																				children: "Partie contre une ia"
																			})
																		})
																	]
																})
															})
														})
													}),
													createElement('div', {
														class: "fa-list-row", children: createElement('div', {
															class: "lobby-card", children: createElement('div', {
																class: "content", style: "background-image: url('/static/images/pong_visual_8.png');", children: createElement('div', {
																	class: "card-container", children: [
																		link({
																			to: "/game/local", children: this.playButton()
																		}),
																		createElement('div', {
																			class: "lobby-name", children: createElement('h2', {
																				children: "Partie locale"
																			})
																		})
																	]
																})
															})
														})
													}),
												]
											})
										]
									}),
								]
							})
						]
					})
				]
			})
		});
	}
}

export default HomePage;