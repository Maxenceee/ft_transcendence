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
        if (callback) {
            this._pendingStateCallbacks.push(callback);
        }
        this._updateComponent();
    }

	setParent(parent) {
        this._parent = parent;
    }

    _updateComponent() {
		let node;
        if (!this._pendingState) return;
        
        this.state = this._pendingState;
        this._pendingState = null;

        const oldElement = this._element && this._element.element || null;
        const newElement = this.render();
		console.log("reloading element", this, oldElement, newElement);
        if (node = (this._parent || (oldElement && oldElement.parentNode))) {
            node.replaceChild(newElement, oldElement);
        }
        // this._element = newElement;

        this._pendingStateCallbacks.forEach(callback => callback());
        this._pendingStateCallbacks = [];
    }   

    render() {
        throw new Error('La méthode render doit être implémentée');
    }
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

// function createElement(type, props = {}) {
// 	let t;
// 	if (typeof type === 'function') {
// 		return new type(props);
// 	} else {
// 		type = type.toLowerCase();
// 		let element = (["svg", "path", "circle", "text"].includes(type) ? document.createElementNS(Is(type), type) : document.createElement(type));
// 		let jv = function(c) {
// 			if (c instanceof Component) {
// 				(c = c.render()) && (element.appendChild(c));
// 			} else if (typeof c === 'string') {
// 				element.appendChild(document.createTextNode(c));
// 			} else {
// 				element.appendChild(c);
// 			}
// 		}
// 		Object.keys(props).forEach(key => {
// 			if (key === 'children') {
// 				const children = props[key];
// 				if (!children) return;
// 				if (Array.isArray(children)) {
// 					children.forEach(child => jv(child));
// 				} else {
// 					jv(children);
// 				}
// 			} else if (key.startsWith('on') && typeof props[key] === 'function') {
// 				element.addEventListener(key.substring(2).toLowerCase(), props[key]);
// 			} else {
// 				element.setAttribute(key, props[key]);
// 			}
// 		});
// 		return element;
// 	}
// }

function createElement(type, props = {}) {
    let t;
    if (typeof type === 'function') {
        return new type(props);
    } else {
        type = type.toLowerCase();
        let element = (["svg", "path", "circle", "text"].includes(type) ? document.createElementNS(Is(type), type) : document.createElement(type));
        let jv = function(c) {
            if (c instanceof Component) {
				console.log("c instanceof Component", c);
				(c = c.render()) && (element.appendChild(c));
            } else if (typeof c === 'string') {
                element.appendChild(document.createTextNode(c));
            } else {
				(c = c.render() || c);
                element.appendChild(c);
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
			element: element,
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
        window.addEventListener('popstate', () => {
            this.setState({ route: window.location.pathname });
        });
    }

    render() {
        const { children } = this.props;
        const { route } = this.state;

		const currentRoute = children.find(child => child.props.path === route);
		console.log("router", currentRoute, this);
        if (currentRoute) {
			this._element = currentRoute.render();
        } else {
			this._element = null;
        }
		return (this._element && this._element.render() || null);
    }
}

class Route extends Component {
	constructor(props) {
		super(props);
		if (props.path === void 0) throw new Error('Missing `path` prop');
		if (props.element === void 0) throw new Error('Missing `element` prop');
		this.state = { route: props.path };
	}
	render() {
		const { element } = this.props;

		this._element = element.render();
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
	let element = this._children.render();
	console.log("root element", element);
	// console.log(JSON.stringify(element));
	// setParentToComponents(element);
	this._internalRoot.appendChild(element.render());
}

function setParentToComponents(obj) {
    const stack = [obj]; // Utilisation d'une pile pour la traversée non récursive
    const visited = new Set(); // Utilisé pour éviter les références circulaires

    while (stack.length > 0) {
        const current = stack.pop();

        // Si l'élément est une instance de Component, définissez son parent
        if (current instanceof Component) {
            if (stack.length > 0) {
                const parent = stack[stack.length - 1];
                current.setParent(parent);
            }
        }

        // Parcourez toutes les propriétés de l'objet actuel
        for (const key in current) {
            if (current.hasOwnProperty(key)) {
                const child = current[key];
                // Vérifiez si l'enfant est un objet et n'a pas été visité
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
		this.state = { username: "Maxence" };
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
										class: "container-title", children: "Bonjour {{ username }}, commençons à jouer !"
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

class UserPage extends Component {
	constructor(props) {
		super(props);
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
													children: "{{ username }}"
												})
											}),
											createElement('div', {
												class: "card-picture", children: createElement('img', {
													src: "user_profile_picture", alt: "profile-picture"
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
													createElement('div', {
														class: "history-card-content", children: [
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "lost", children: "Defeat"
																	}),
																	createElement('div', {
																		class: "note score", children: "6 - 10"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "win", children: "Victory"
																	}),
																	createElement('div', {
																		class: "note score", children: "10 - 9"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "win", children: "Victory"
																	}),
																	createElement('div', {
																		class: "type", children: "4 Players"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "lost", children: "Defeat"
																	}),
																	createElement('div', {
																		class: "note score", children: "2 - 10"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "win", children: "Victory"
																	}),
																	createElement('div', {
																		class: "note score", children: "10 - 8"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "win", children: "Victory"
																	}),
																	createElement('div', {
																		class: "note score", children: "10 - 5"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "win", children: "Victory"
																	}),
																	createElement('div', {
																		class: "note score", children: "10 - 4"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "lost", children: "Defeat"
																	}),
																	createElement('div', {
																		class: "note score", children: "6 - 10"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "win", children: "Victory"
																	}),
																	createElement('div', {
																		class: "note score", children: "10 - 7"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "lost", children: "Defeat"
																	}),
																	createElement('div', {
																		class: "note score", children: "9 - 10"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "lost", children: "Defeat"
																	}),
																	createElement('div', {
																		class: "note score", children: "4 - 10"
																	}),
																	createElement('div', {
																		class: "type", children: "Normal"
																	})
																]
															}),
															createElement('div', {
																class: "history-row", children: [
																	createElement('div', {
																		class: "lost", children: "Defeat"
																	}),
																	createElement('div', {
																		class: "type", children: "4 Players"
																	})
																]
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
					})
				]
			})
		});		
	}
}

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
		return createElement('div', {
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
						route({path: "/", element: createElement(HomePage)}),
						route({path: "/user/me", element: createElement(UserPage)})
					)
				})
			]
		});
    }
}

App.createRoot(document.getElementById('root')).render(createElement(Main));