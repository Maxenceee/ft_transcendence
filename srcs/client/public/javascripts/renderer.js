/*!






 __  __                                                  ____
|  \/  |   __ _  __  __   ___   _ __     ___    ___     / ___|   __ _   _ __ ___     __ _ 
| |\/| |  / _` | \ \/ /  / _ \ | '_ \   / __|  / _ \   | |  _   / _` | | '_ ` _ \   / _` |
| |  | | | (_| |  >  <  |  __/ | | | | | (__  |  __/   | |_| | | (_| | | | | | | | | (_| |
|_|  |_|  \__,_| /_/\_\  \___| |_| |_|  \___|  \___|    \____|  \__,_| |_| |_| |_|  \__,_|







 */

/**!
 *   @license © Copyright 2024, All rights reserved.
 *   @author Maxence Gama, @maxencegama
 *   @contact contact@maxencegama.dev
 */

/**
 * 
 ************************************************************************************************************
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 ************************************************************************************************************
 */

class Component {
	constructor(props) {
		this.props = props || {};
		this.state = {};
		this._pendingState = null;
		this._pendingStateCallbacks = [];
		this._element = null;
		this._parent = null;
	}

	setState(newState, callback) {
		this._pendingState = Object.assign({}, this.state, newState);
		console.log("this._pendingState", this._pendingState);
		if (callback) {
			this._pendingStateCallbacks.push(callback);
		}
		this._updateComponent();
	}

	setParent(parent) {
		this._parent = parent;
	}

	_renderComponent() {
		console.log("render component", this);
		let render = this.render();
		this.componentDidMount();
		return render;
	}

	_updateComponent() {
		let node;
		if (!this._pendingState) return;
		
		this.state = this._pendingState;
		this._pendingState = null;

		console.log("this.state, this._pendingState", this.state, this._pendingState, this);

		const oldElement = this._element && this._element || null;
		let newElement = this.render();
		if (newElement instanceof Component) {
			newElement = newElement._renderComponent();
		}
		console.log("reloading element", this, oldElement, newElement);
		if ((node = (this._parent || (oldElement && oldElement._element.parentNode)))) {
			console.log("node", node, oldElement, newElement);
			if (newElement && oldElement) {
				node.replaceChild(newElement._element, oldElement._element);
				this._parent = newElement._element.parentNode
			} else if (newElement) {
				node.appendChild(newElement._element);
				this._parent = newElement._element.parentNode
			} else {
				node.removeChild(oldElement._element);
			}
		}

		this._pendingStateCallbacks.forEach(callback => callback());
		this._pendingStateCallbacks = [];

		this.componentDidUpdate();
		this._element = newElement;
	}

	render() {
		throw new Error('La méthode render doit être implémentée');
	}

	componentDidMount() {}

	componentDidUpdate() {}
}

function Is(e) {
	switch (e) {
		case "svg":
			return "http://www.w3.org/2000/svg";
		case "math":
			return "http://www.w3.org/1998/Math/MathML";
		default:
			return "http://www.w3.org/2000/svg";
	}
}

function createElement(type, props = {}) {
	let t;
	if (typeof type === 'function') {
		return new type(props);
	} else {
		type = type.toLowerCase();
		let element = (["svg", "path", "circle", "text", "g"].includes(type) ? document.createElementNS(Is(type), type) : document.createElement(type));
		let jv = function(c) {
			if (c instanceof Component) {
				console.log("=== c ===", c);
				t = c;
				c = c._renderComponent(); //&& (c instanceof HTMLElement ? element.appendChild(c) : element.appendChild(c.render()));
				t._element = c;
				// console.log("c instanceof Component", c);
			}
			if (typeof c === 'string') {
				element.appendChild(document.createTextNode(c));
			} else {
				c && element.appendChild(c.render());
			}
		}
		Object.keys(props).forEach(key => {
			if (key === 'children') {
				const children = props[key];
				if (!children) return;
				if (Array.isArray(children)) {
					children.forEach(child => jv(child));
				} else {
					jv(children);
				}
			} else if (key.startsWith('on') && typeof props[key] === 'function') {
				element.addEventListener(key.substring(2).toLowerCase(), props[key]);
			} else {
				element.setAttribute(key, props[key]);
			}
		});
		return {
			data: props,
			_element: element,
			render() {
				return element;
			}
		};
	}
}

class Router extends Component {
	constructor(props) {
		super(props);
		console.log(this);
		this.state = { route: window.location.pathname };
		this.previousRoute = window.location.pathname;
		window.addEventListener('popstate', () => {
			const newRoute = window.location.pathname;
			if (newRoute !== this.previousRoute) {
				this.setState({ route: newRoute });
				this.previousRoute = newRoute;
			}
		});
	}

	render() {
		const { children } = this.props;
		const { route } = this.state;

		const currentRoute = children.find(child => child.props.path === route);
		console.log("router", currentRoute, this);
		if (currentRoute) {
			currentRoute.active = true;
			this._element = currentRoute.render();
		} else {
			this._element = null;
		}
		// console.log("in render router", this, this._element);
		return (this._element && this._element || null);
	}
}

class Route extends Component {
	constructor(props) {
		super(props);
		if (props.path === void 0 || !props.path.length) throw new Error('Missing `path` prop');
		if (props.element === void 0) throw new Error('Missing `element` prop');
		this.state = { route: props.path.replace(/^\/*/, "/") };
		this.active = false;
	}

	canRoute(route) {
		if (this.state.route === route) return true;
        const regex = new RegExp("^" + this.state.route.replace(/\*/g, '.*') + "$");
        return regex.test(route);
	}

	render() {
		const { element } = this.props;

		this._element = element.render();
		// console.log("in render route", this, this._element);
		return this._element;
	}
}

function router(...routes) {
	return createElement(Router, { children: routes });
}

function route({ path, element }) {
	return createElement(Route, { path, element });
}


function link(props) {
	const { to, children } = props;

	if (to === void 0) throw new Error('Missing `to` prop');

	const handleClick = (event) => {
		event.preventDefault();
		window.history.pushState({}, '', to);
		window.dispatchEvent(new Event('popstate'));
	};

	return createElement('a', { href: to, onClick: handleClick, children });
}

let renderer = function() {
	this._internalRoot = root;
}
renderer.prototype.render = function(elem) {
	this._children = elem;
	if (this._internalRoot === null) throw Error('Unable to find root node.');
	let element = (this._children instanceof Component ? this._children._renderComponent() : this._children).render();
	console.log("root element", this, element);
	this._children._element = element;
	// console.log(JSON.stringify(element));
	// setParentToComponents(element);
	this._internalRoot.appendChild(element.render());
}

function setParentToComponents(obj) {
	const stack = [obj]; 
	const visited = new Set();

	while (stack.length > 0) {
		const current = stack.pop();

		if (current instanceof Component) {
			if (stack.length > 0) {
				const parent = stack[stack.length - 1];
				current.setParent(parent);
			}
		}

		for (const key in current) {
			if (current.hasOwnProperty(key)) {
				const child = current[key];
				if (typeof child === 'object' && child !== null && !visited.has(child)) {
					stack.push(child);
					visited.add(child);
				}
			}
		}
	}
}

const App = {
	createRoot: function(t) {
		while (t.firstChild) {
			t.removeChild(t.firstChild);
		}
		return (
			new renderer(t)
		);
	},
}

/**
 * 
 * 
 * 
 * 
 */

// class Page1 extends Component {
// 	render() {
// 		// let route1 = route({path: "/", element: "non"});
// 		// let route2 = route({path: "/oui", element: "oui"});
// 		// return createElement('div', {children: [createElement('p', {children: "page 1"}), link({to: "/about", children: "click me"}), createElement('p', {children: router(route1, route2)})]});
// 		return createElement('div', {children: [createElement('p', {children: "page 1"}), link({to: "/about", children: "click me"}), createElement('p', {children: "oui"})]});
// 	}
// }

// class Page2 extends Component {
// 	render() {
// 		return createElement('div', {children: [createElement('p', {children: "page 2"}), link({to: "/", children: "click me"})]});
// 	}
// }

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
	}

	render() {
		return createElement('div', {
			children: createElement('div', {
				class: "data", children: [
					createElement('div', {
						class: "featured-bar", children: createElement('div', {
							class: "featured-bar-margin", children: createElement('div', {
								class: "featured-bar-content", children: createElement('div', {
									class: "featured-bar-primary-row", children: createElement('div', {
										class: "feature-title"
									})
								})
							})
						})
					}),
					createElement('section', {
						children: createElement('div', {
							class: "oa-container", children: createElement('div', {
								class: "lobby-container page-card", children: [
									createElement('h2', {
										class: "container-title", children: ("Bonjour <user>, commençons à jouer !").replace("<user>", this.state.user.nickname)
									}),
									createElement('div', {
										class: "fa-list", children: [
											createElement('div', {
												class: "fa-list-row", children: createElement('div', {
													class: "lobby-card", children: createElement('div', {
														class: "content", style: "background-image: url('/static/images/pong_visal_2.png');", children: createElement('div', {
															class: "card-container", children: [
																link({
																	to: "/game/2", children: createElement('div', {
																		class: "play-button", children: createElement('svg', {
																			width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
																				d: "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892Z"
																			})
																		})
																	})
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
														class: "content", style: "background-image: url('/static/images/pong_visal_3.png');", children: createElement('div', {
															class: "card-container", children: [
																link({
																	to: "/game/4", children: createElement('div', {
																		class: "play-button", children: createElement('svg', {
																			width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
																				d: "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892Z"
																			})
																		})
																	})
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
														class: "content", style: "background-image: url('/static/images/pong_visal_1.png');", children: createElement('div', {
															class: "card-container", children: [
																createElement('div', {
																	class: "play-button", children: createElement('svg', {
																		width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
																			d: "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892Z"
																		})
																	})
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
							})
						})
					}),
					createElement('section', {
						children: createElement('div', {
							class: "gr-container", children: [
								createElement('div', {
									class: "home-view-container", children: createElement('div', {
										class: "home-image-card", children: [
											createElement('h2', {
												children: "Some view"
											}),
											createElement('img', {
												src: "", alt: ""
											})
										]
									})
								}),
								createElement('div', {
									class: "home-view-container", children: [
										createElement('div', {
											class: "home-view-card", children: [
												createElement('div', {
													class: "card-title", children: createElement('h2', {
														children: "Some data"
													})
												}),
												createElement('div', {
													class: "card-progress-view", children: createElement('progress', {
														value: "0", max: "100", style: "--value: 70; --max: 100;"
													})
												})
											]
										}),
										createElement('div', {
											class: "home-view-card", children: [
												createElement('div', {
													class: "card-title", children: createElement('h2', {
														children: "Some other data"
													})
												}),
												createElement('div', {
													class: "card-progress-view", children: createElement('progress', {
														value: "0", max: "100", style: "--value: 50; --max: 100;"
													})
												})
											]
										})
									]
								})
							]
						})
					})
				]
			})
		});
	}
}

class UserPagePlayerHistory extends Component {
	constructor(props) {
		super(props);
		// this.history = [...Array(Math.floor(Math.random() * 10))].fill({});
		this.state = { user: props.user };
		console.log(this.state);
	}
	
	componentDidUpdate() {
		console.log("this.componentDidUpdate");
	}

	render() {
		console.log("render user page", this);
		return createElement('div', {children: [
			createElement('div', {
				class: "history-card-content", children: (
					(this.state.user.game_history && this.state.user.game_history.length) ?
					this.state.user.game_history.sort((a, b) => a.date > b.date).map(game => {
						let p = game.data.sort((a, b) => a.score < b.score);
						console.log(p);
						if (game.type === "2v2") {
							return createElement('div', {
								class: "history-row", children: [
									(
										p[0].id == this.state.user.id ?
										createElement('div', {
											class: "win", children: "Victory"
										})
										:
										createElement('div', {
											class: "lost", children: "Defeat"
										})
									),
									createElement('div', {
										class: "note score", children: "".concat(p[0].score, " - ", p[1].score)
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
										p[0].id == this.state.user.id ?
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
						createElement('p', {children: "No game played yet", style: "text-align: center;"})
					})
				)
			})
		]})
	}
}

class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
	}

	render() {
		return createElement('div', {
			children: createElement('div', {
				class: "data", children: [
					createElement('div', {
						class: "featured-bar", children: createElement('div', {
							class: "featured-bar-margin", children: createElement('div', {
								class: "featured-bar-content", children: createElement('div', {
									class: "featured-bar-primary-row", children: createElement('div', {
										class: "feature-title"
									})
								})
							})
						})
					}),
					createElement('section', {
						class: "player-profile", children: createElement('div', {
							class: "oa-container", children: createElement('div', {
								class: "player-container", children: [
									createElement('div', {
										class: "player-card", children: [
											createElement('div', {
												class: "card-header", children: createElement('h2', {
													children: this.state.user.nickname
												})
											}),
											createElement('div', {
												class: "card-picture", children: createElement('img', {
													src: this.state.user.profile_picture, alt: "profile-picture"
												})
											})
										]
									}),
									createElement('div', {
										class: "card-container", children: [
											createElement('div', {
												class: "stat-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Statistics"
														})
													}),
													createElement('div', {
														class: "stat-card-content", children: [
															createElement('div', {
																class: "stat-group w-full", children: [
																	createElement('h1', {
																		children: "Normal"
																	}),
																	createElement('p', {
																		class: "note", children: "20 Played"
																	}),
																	createElement('p', {
																		class: "note", children: "WR: 55%"
																	}),
																	createElement('div', {
																		class: "progress-bar", style: "--value: 55%;", children: [
																			createElement('div', {
																				
																			}),
																			createElement('div', {
																				
																			})
																		]
																	})
																]
															}),
															createElement('div', {
																class: "stat-group w-full", children: [
																	createElement('h1', {
																		children: "4 Players"
																	}),
																	createElement('p', {
																		class: "note", children: "1 Played"
																	}),
																	createElement('p', {
																		class: "note", children: "WR: 100%"
																	}),
																	createElement('div', {
																		class: "progress-bar", style: "--value: 100%;", children: [
																			createElement('div', {
																				
																			}),
																			createElement('div', {
																				
																			})
																		]
																	})
																]
															}),
															createElement('div', {
																class: "stat-group w-full", children: [
																	createElement('h1', {
																		children: "Tournament"
																	}),
																	createElement('p', {
																		class: "note", children: "0 Played"
																	}),
																	createElement('p', {
																		class: "note", children: "WR: none"
																	}),
																	createElement('div', {
																		class: "progress-bar", style: "--value: none;", children: [
																			createElement('div', {
																				
																			}),
																			createElement('div', {
																				
																			})
																		]
																	})
																]
															})
														]
													})
												]
											}),
											createElement('div', {
												class: "history-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Game History"
														})
													}),
													createElement(UserPagePlayerHistory, {user: this.state.user}),
												]
											})
										]
									})
								]
							})
						})
					})
				]
			})
		});		
	}
}

class Loader extends Component {
	render() {
		return createElement('div', {
			class: "ad-up-box-loader", children: createElement('div', {
				class: "loader", children: createElement('div', {
					class: "inner-loader"
				})
			})
		})		
	}
}

class BadConnection extends Component {
	render() {
		return createElement('div', {
			class: "preload", children: [
				// createElement('svg', {
				// 	height: "75px", width: "75px", class: "icon", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", viewBox: "0 0 622.09431 815.20567", children: [
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m185.78512,722.53752c-2.3257-2.57814-4.55636-5.1912-6.72495-7.82005,30.41037,65.64506,52.64157,100.4882,52.64157,100.4882v-52.9691c-14.53391-10.38544-32.05025-24.32663-45.91663-39.69905Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m420.98693,21.67264c83.16529,150.85703,201.10737,226.82161,201.10737,226.82161,0,0-68.15333-35.82915-112.04384-80.27478-65.17563-65.99995-89.06353-146.54683-89.06353-146.54683Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m134.28938,615.53255c55.06509,109.34912,133.15648,164.41225,133.15648,164.41225,0,0-45.12543-25.97086-74.18606-58.18739-43.15385-47.84024-58.97042-106.22486-58.97042-106.22486Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m429.32177,55.4862c-54.85948,22.14835-112.63212,57.37888-143.26722,112.52183-22.08683-39.75613-58.52219-64.03704-103.8231-84.85531,0,0,30.81438,12.30852,50.19727,25.08617,30.96402,20.41204,43.47981,38.43769,43.47981,38.43769,0,0-13.19468-24.63034-36.39075-39.81986C176.65619,65.69319,73.59594,33.00034,73.59594,33.00034,42.13204,61.01435,18.75641,105.26588,14.73652,174.29877c9.15318,76.9912,26.85351,154.81205,48.44212,228.43593,33.76356,83.30965,71.23362,114.22406,71.23362,114.22406,0,0-35.84015-18.589-53.42355-56.74875,21.90311,66.83493,44.32635,128.4914,71.76205,178.87183,23.61144,43.3576,53.23955,77.43706,79.13042,104.30664v-52.66596s-53.31299-100.0828-100.68854-236.80131c-24.2424-101.91915-26.42013-211.99446-26.42013-211.99446,0,0-.95489,126.3871,7.71198,154.79321-27.58062-89.76553-49.86032-190.2166-52.89706-286.48207,0,0,149.24122,16.85213,226.46713,140.75891,49.53001-79.46987,128.62579-114.86693,179.02452-130.05813-16.61022-24.72704-28.25065-48.12456-35.7573-65.45247Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m554.13826,199.45559c.02577-.18233.05514-.36439.08091-.54672-1.15856-.88229-2.30741-1.81445-3.46431-2.71309,1.13279,1.09565,2.26613,2.19325,3.38339,3.25981Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m268.06467,87.83386S116.67847-59.02596,32.75952,27.05312C-22.26819,83.49728,8.66415,248.49425,8.66415,248.49425-2.10994,147.50711,10.05288,71.04401,49.84801,36.84784c69.51309-59.73298,218.21666,50.98601,218.21666,50.98601Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m582.87994,69.88295s-2.03946,22.61221-21.45809,64.14317c0,0,3.73171-75.18174,1.26219-113.55376,0,0-54.78716,6.09177-117.43649,28.90128,14.67856,23.75608,30.05097,45.35079,45.40066,64.84313,13.58096-3.02261,21.87319-3.97888,21.87319-3.97888-.30121,9.54777-.81024,19.13987-1.47639,28.7558,15.60989,18.09243,30.81854,33.88909,44.88193,47.45619,1.40905-10.82437,3.17003-27.0037,3.17003-27.0037,23.45986-51.9926,23.78296-89.56324,23.78296-89.56324Z"
				// 			})
				// 		}),
				// 		createElement('g', {
				// 			children: createElement('path', {
				// 				class: "cls-1", d: "m552.38228,211.31964c-13.70372-10.28707-27.47726-21.75791-39.44661-33.87856-1.66122-1.68228-3.27754-3.37952-4.88556-5.07925-6.86599,62.96356-23.40117,125.61745-37.22925,186.13103-11.41582,49.9572-36.20445,108.35402-106.93224,212.67687,90.68041-107.64585,98.69126-152.16376,103.9393-181.34491-50.89058,168.2262-127.60027,300.8977-127.60027,300.8977v124.48315s31.11143-56.61464,70.13242-145.26539c9.35103-52.72997,1.32288-94.07056,1.32288-94.07056,0,0,10.99007,26.27991,14.03014,58.43518,48.09491-114.08274,103.09793-268.58333,126.66919-422.98527Z"
				// 			})
				// 		})
				// 	]
				// }),
				createElement('div', {
					style: "margin-top: 10; position: relative; display: flex; flex-direction: row; align-content: center", children: [
						createElement('svg', {
							style: "margin-right: 5; color: #818185; height: 100%", width: "22", height: "22", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
								createElement('path', {
									d: "M10.4152 4.50378C6.2126 5.26292 2.41385 7.36925 0.135958 10.1745C-0.0534164 10.3873 -0.0491978 10.699 0.175332 10.931L1.81572 12.5991C2.07541 12.8513 2.45416 12.8492 2.70212 12.5853C4.85158 10.3015 7.52135 8.82471 10.4853 8.24979L10.4152 4.50378ZM16.8846 4.51339L16.8263 8.25729C19.7944 8.81299 22.4492 10.3132 24.6413 12.5991C24.8796 12.8375 25.2445 12.8257 25.5021 12.5735L27.1425 10.931C27.3766 10.699 27.3713 10.3873 27.1819 10.1745C24.8827 7.38636 21.1298 5.22987 16.8846 4.51339ZM16.7977 11.5395L16.7393 15.4486C17.9124 15.9005 18.9617 16.6191 19.756 17.471C19.9943 17.7349 20.3316 17.719 20.6147 17.4614L22.4468 15.6642C22.6596 15.4439 22.6873 15.1523 22.4883 14.9278C21.2044 13.3816 19.1646 12.0975 16.7977 11.5395ZM10.5352 11.5416C8.17244 12.1306 6.14979 13.3549 4.83916 14.9278C4.64018 15.1523 4.65822 15.4343 4.88064 15.6642L6.72236 17.4806C7.00759 17.752 7.37041 17.719 7.6322 17.422C8.40306 16.5743 9.43643 15.8812 10.5957 15.4336L10.5352 11.5416Z", style: "fill: currentcolor"
								}),
								createElement('path', {
									d: "M13.659 24.0201C14.7775 24.0201 15.6723 23.1272 15.6723 22.0289C15.6723 20.921 14.7775 20.0473 13.659 20.0473C12.5439 20.0473 11.6436 20.921 11.6436 22.0289C11.6436 23.1272 12.5439 24.0201 13.659 24.0201ZM13.6686 18.0722C14.4775 18.0722 14.9753 17.5608 14.9975 16.7264C15.0369 12.8505 15.1121 8.21931 15.141 4.4435C15.141 3.61523 14.5091 3 13.6611 3C12.8132 3 12.1771 3.61523 12.1771 4.4435C12.2155 8.2172 12.2929 12.8505 12.3418 16.7264C12.3641 17.5608 12.8577 18.0722 13.6686 18.0722Z", style: "fill: currentcolor"
								})
							]
						}),
						createElement('p', {
							style: "color: #818185; font-size: 20", children: "Unable to connect"
						})
					]
				})
			]
		})
	}
}		

class Main extends Component {
    constructor(props) {
        super(props);
		this.state = { user: null, loading: true, error: null };
    }

	loadUser() {
		fetch('http://localhost:3000/api/user/me/get', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(data => {
			console.log("data", data);
			this.setState({ user: data, loading: false });
		})
		.catch(error => {
			console.log("error", error);
			this.setState({ loading: false, error: "An error occured" });
		})
	}

	componentDidMount() {
		console.log("==================== Main mounted ====================");
		setTimeout(() => {
			this.loadUser();
		}, 1500);
	}

    render() {
		console.log("main state on render", this.state);
		return (
			this.state.loading ?
			createElement(Loader)
			:
			this.state.error != null ?
			createElement(BadConnection)
			:
			createElement('div', {
				class: "home", children: [
					createElement('div', {
						class: "nav-bar", children: createElement('nav', {
							children: [
								createElement('div', {
									class: "nav-container", children: [
										link({
											to: "/", children: createElement('div', {
												class: "icon-container", children: createElement('svg', {
													class: "icon", width: "29", height: "28", viewBox: "0 0 29 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
														d: "M17.3688 22.7488H11.2228V15.1419C11.2228 14.5944 11.5903 14.2386 12.1378 14.2386H16.4655C17.013 14.2386 17.3688 14.5944 17.3688 15.1419V22.7488ZM3.78914 22.3431C3.78914 24.0268 4.84734 25.0447 6.58194 25.0447H22.0364C23.771 25.0447 24.8175 24.0268 24.8175 22.3431V13.4141L15.0286 5.20275C14.5727 4.81931 14.0306 4.82892 13.5844 5.20275L3.78914 13.4141V22.3431ZM0 11.814C0 12.4189 0.455153 12.935 1.19765 12.935C1.56163 12.935 1.886 12.7466 2.17217 12.5115L13.8119 2.7458C14.1267 2.46713 14.4958 2.46713 14.8127 2.7458L26.4462 12.5115C26.7248 12.7466 27.0492 12.935 27.4132 12.935C28.0863 12.935 28.6012 12.5171 28.6012 11.8428C28.6012 11.447 28.4482 11.1409 28.1515 10.8878L15.9544 0.635973C14.9522 -0.211991 13.6821 -0.211991 12.6703 0.635973L0.459372 10.8899C0.153045 11.1451 0 11.4875 0 11.814ZM21.547 6.13864L24.8576 8.92464V3.26801C24.8576 2.73973 24.521 2.40317 23.9927 2.40317H22.414C21.8953 2.40317 21.547 2.73973 21.547 3.26801V6.13864Z"
													})
												})
											})
										}),
										link({
											to: "/user/me", children: createElement('div', {
												class: "icon-container", children: createElement('svg', {
													class: "icon", width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
														d: "M14.105 26.21C20.7369 26.21 26.2121 20.7273 26.2121 14.105C26.2121 7.47312 20.7273 2 14.0954 2C7.47523 2 2 7.47312 2 14.105C2 20.7273 7.48484 26.21 14.105 26.21ZM14.105 23.8255C8.71085 23.8255 4.39412 19.4991 4.39412 14.105C4.39412 8.71085 8.70124 4.38452 14.0954 4.38452C19.4895 4.38452 23.8276 8.71085 23.8276 14.105C23.8276 19.4991 19.4991 23.8255 14.105 23.8255ZM21.9181 21.8361L21.8766 21.6418C21.14 19.9212 18.196 18.1442 14.105 18.1442C10.0257 18.1442 7.07959 19.9212 6.33545 21.6322L6.29397 21.8361C8.49826 23.8651 11.8683 24.9826 14.105 24.9826C16.3534 24.9826 19.6946 23.8747 21.9181 21.8361ZM14.105 16.2132C16.3794 16.2324 18.1414 14.2979 18.1414 11.7847C18.1414 9.4196 16.3655 7.4478 14.105 7.4478C11.8466 7.4478 10.059 9.4196 10.0707 11.7847C10.0803 14.2979 11.8423 16.194 14.105 16.2132Z"
													})
												})
											})
										})
									]
								}),
								createElement('div', {
									class: "nav-bottom", children: createElement('a', {
										href: "/logout", children: createElement('div', {
											class: "icon-container", children: createElement('svg', {
												class: "icon", width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
													createElement('path', {
														d: "M7.41333 16.5205V23.4008C7.41333 25.3365 8.76661 26.6312 10.7865 26.6312H19.9953C21.9856 26.6312 23.3135 25.3365 23.3135 23.3987V4.23249C23.3135 2.29258 21.9856 1 19.9953 1H10.7865C8.76661 1 7.41333 2.29258 7.41333 4.23038V11.1309H9.71136V4.75866C9.71136 3.86545 10.2411 3.36131 11.1802 3.36131H19.5605C20.4879 3.36131 21.0176 3.86967 21.0176 4.76076V22.8705C21.0176 23.7615 20.4879 24.2699 19.5605 24.2699H11.1802C10.2411 24.2699 9.71136 23.7658 9.71136 22.8726V16.5205H7.41333Z"
													}),
													createElement('path', {
														d: "M4.99257 14.7958H12.6859L14.9498 14.6807L12.644 16.7265L11.9992 17.3755C11.8279 17.5607 11.7013 17.8213 11.7013 18.099C11.7013 18.6533 12.1098 19.0384 12.647 19.0384C12.9215 19.0384 13.1694 18.9362 13.3525 18.7511L17.4934 14.6144C17.755 14.3624 17.8858 14.0807 17.8858 13.8161C17.8858 13.5494 17.755 13.2505 17.4934 13.0061L13.3525 8.87895C13.1694 8.69379 12.9215 8.59161 12.647 8.59161C12.1098 8.59161 11.7013 8.97668 11.7013 9.52348C11.7013 9.81082 11.8237 10.0597 11.9992 10.2449L12.644 10.9056L14.9498 12.9419L12.6859 12.8247H4.99257C4.39562 12.8247 4 13.2918 4 13.8161C4 14.3383 4.39562 14.7958 4.99257 14.7958Z"
													})
												]
											})
										})
									})
								})
							]
						})
					}),
					createElement('header', {}),
					createElement('main', {children:
						router(
							route({path: "/", element: createElement(HomePage, {user: this.state.user, reload: this.loadUser.bind(this)})}),
							route({path: "/user/me", element: createElement(UserPage, {user: this.state.user, reload: this.loadUser.bind(this)})}),
							// route({path: "*", element: createElement(NotFound)})
						)
					})
				]
			})
		)
	}
}

App.createRoot(document.getElementById('root')).render(createElement(Main));