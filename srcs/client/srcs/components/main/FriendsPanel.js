import { Component, createElement, link, xhr } from '..';

class FriendsPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			following: props.following || [],
			seachresult: [],
			onsearch: false,
			search: "",
		}
		this.ref = {current: null};

		this.openPanel = this.openPanel.bind(this);
		this.searchPlayer = this.searchPlayer.bind(this);
		this.followPlayer = this.followPlayer.bind(this);
		this.unfollowPlayer = this.unfollowPlayer.bind(this);
	}

	openPanel() {
		this.setState({open: !this.state.open, onsearch: false});
	}

	componentDidUpdate() {
		if (this.state.open && this.state.onsearch && this.ref.current) {
			this.ref.current.focus();
			this.ref.current.setSelectionRange(this.ref.current.value.length, this.ref.current.value.length);
		}
	}

	searchPlayer() {
		if (!this.state.search.length) return;
		xhr.get('/api/user/'+this.state.search+"/search")
		.then(res => res.data)
		.then(data => {
			this.setState({ seachresult: data });
		})
		.catch(error => {
			console.error("error", error);
		})
	}

	followPlayer(id) {
		xhr.post('/api/follow/'+id)
		.then(res => res.data)
		.then(data => {
			console.log("data", data);
			this.setState({ following: data.following });
			// this.props.reload();
		})
		.catch(error => {
			console.error("error", error);
		})
	}

	unfollowPlayer(id) {
		xhr.post('/api/unfollow/'+id)
		.then(res => res.data)
		.then(data => {
			console.log("data", data);
			this.setState({ following: data.following });
		})
		.catch(error => {
			console.error("error", error);
		})
	}

	playerRow(player) {
		let action = [
			{title: "Follow", color: "var(--friend-bg)", hover: "var(--friend-bg-h)", action: this.followPlayer},
			{title: "Unfollow", color: "#8e8e8e", hover: "#555555", action: this.unfollowPlayer}
		]
		let isfr = (e) => this.state.following.find(f => f.id == e);
		let opt = action[isfr(player.id) ? 1 : 0];
		return createElement('div', {
			class: "friend-row", children: [
				createElement('div', {
					class: "friend-avatar", children: createElement('img', {
						src: player.profile_picture
					})
				}),
				createElement('span', {
					class: "friend-middle-row", children: [
						createElement('div', {
							class: "friend-name", children: link({to: "/user/"+player.id, children: player.nickname})
						}),
						createElement('div', {
							class: "friend-status"+(player.is_online ?  "on" : " off"), children: player.is_online ? "Online" : "Offline"
						})
					]
				}),
				createElement('div', {
					class: "friend-action", children: createElement('button', {
						onclick: () => opt.action(player.id), children: opt.title, style: "--friend-action-color: "+opt.color+"; --friend-action-color-h: "+opt.hover
					})
				})
			]
		})
	}

	render() {
		return createElement('div', {
			class: "header-content", children: createElement('div', {
				class: "friend-button", children: [
					createElement('div', {
						class: "friend-icon", onclick: this.openPanel, children: createElement('label', {
							class: "menu", children: [
								createElement('input', {
									type: "checkbox", disabled: true
								}),
								createElement('div', {}),
								createElement('div', {}),
								createElement('div', {})
							]
						})
						// createElement('svg', {
						// 	class: "icon", width: "14", height: "10", viewBox: "0 0 14 10", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
						// 		d: "M1.54037 2.14763H12.6908C13.2676 2.14763 13.6826 1.78153 13.6826 1.2249C13.6826 0.675756 13.2676 0.307556 12.6908 0.307556H1.54037C0.951857 0.307556 0.546387 0.675756 0.546387 1.2249C0.546387 1.78153 0.951857 2.14763 1.54037 2.14763ZM1.54037 6.01598H12.6908C13.2676 6.01598 13.6826 5.64988 13.6826 5.09328C13.6826 4.54408 13.2676 4.17588 12.6908 4.17588H1.54037C0.951857 4.17588 0.546387 4.54408 0.546387 5.09328C0.546387 5.64988 0.951857 6.01598 1.54037 6.01598ZM1.54037 9.89398H12.6908C13.2676 9.89398 13.6826 9.51828 13.6826 8.97118C13.6826 8.42208 13.2676 8.05388 12.6908 8.05388H1.54037C0.951857 8.05388 0.546387 8.42208 0.546387 8.97118C0.546387 9.51828 0.951857 9.89398 1.54037 9.89398Z"
						// 	})
					}),
					createElement('div', {
						class: "friend-container", children: [
							createElement('div', {
								class: "friend-search", style: (this.state.open ? "width: 280px" : ""), children: [
									this.state.open && createElement('div', {
										class: "friend-search-header", children: [
											createElement('div', {
												class: "friend-search-icon", style: (this.state.onsearch ? "color: var(--friend-bg)" : ""), onclick: () => this.setState({onsearch: !this.state.onsearch, search: "", seachresult: []}), children: createElement('svg', {
													class: "icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
														d: "M0 9.53718C0 14.801 4.27757 19.0765 9.53929 19.0765C11.4961 19.0765 13.2919 18.4751 14.7891 17.46L20.1729 22.8534C20.5099 23.1905 20.9564 23.351 21.4263 23.351C22.4236 23.351 23.1368 22.5973 23.1368 21.6117C23.1368 21.1481 22.9666 20.7155 22.6446 20.3935L17.3022 15.0202C18.4207 13.4815 19.0786 11.5898 19.0786 9.53718C19.0786 4.27547 14.801 0 9.53929 0C4.27757 0 0 4.27547 0 9.53718ZM2.48482 9.53718C2.48482 5.64491 5.64702 2.48482 9.53929 2.48482C13.4316 2.48482 16.5916 5.64491 16.5916 9.53718C16.5916 13.4316 13.4316 16.5916 9.53929 16.5916C5.64702 16.5916 2.48482 13.4316 2.48482 9.53718Z"
													})
												})
											}),
											this.state.onsearch ?
											createElement('div', {
												class: "friend-search-input", children: createElement('input', {
													ref: this.ref, value: this.state.search, onkeydown: this.searchPlayer, placeholder: "Rechercher", oninput: e => this.setState({search: e.target.value})
												})
											})
											:
											createElement('div', {
												class: "friend-search-label", children: "Friends"
											})
										]
									}),
									!this.state.onsearch && createElement('div', {
										class: "friend-count", children: ((this.state.following.filter(e => e.is_online).length)+"/"+this.state.following.length)
									})
								]
							}),
						]
					}),
					this.state.open && createElement('div', {
						class: "friend-list", children: (
							this.state.onsearch && this.state.seachresult && this.state.seachresult.length ?
							this.state.seachresult.map(player => this.playerRow(player))
							:
							this.state.onsearch && this.state.seachresult && !this.state.seachresult.length && this.state.search.length ?
							createElement('div', {
								class: "friend-row empty", children: "Aucun résultat"
							})
							:
							this.state.following.length ?
							this.state.following.map(player => this.playerRow(player))
							:
							createElement('div', {
								class: "friend-row empty", children: "Vous ne suivez personne"
							})
						)
					})
				]
			})
		})
	}
}

export default FriendsPanel;