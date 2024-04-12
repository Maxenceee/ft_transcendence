import { AlertBanner, Component, createElement, link } from '..';
import axios from "axios";
import { ismax } from '../proto/Component';

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
		this.setState({open: !this.state.open, onsearch: false}, (state) => {
			if (!state.open) return;
			axios.get('/api/user/'+this.props.id+'/following')
			.then(res => res.data)
			.then(data => {
				this.setState({ following: data.following || [] });
			});
		});
	}

	componentDidUpdate() {
		if (this.state.open && this.state.onsearch && this.ref.current) {
			this.ref.current.focus();
			this.ref.current.setSelectionRange(this.ref.current.value.length, this.ref.current.value.length);
		}
	}

	searchPlayer() {
		if (!this.state.search.length) return;
		axios.post('/api/user/search', {search: this.state.search})
		.then(res => res.data)
		.then(data => {
			this.setState({ seachresult: data });
		})
		.catch(_ => {});
	}

	followPlayer(id) {
		axios.post('/api/follow/'+id)
		.then(res => res.data)
		.then(data => {
			this.setState({ following: data.following });
		})
		.catch(error => {
			new AlertBanner({ message: error.response.data.error || "Une erreur s'est produite, veuillez réessayer plus tard.", color: "error"});
		})
	}

	unfollowPlayer(id) {
		axios.post('/api/unfollow/'+id)
		.then(res => res.data)
		.then(data => {
			this.setState({ following: data.following });
		})
		.catch(error => {
			new AlertBanner({ message: error.response.data.error || "Une erreur s'est produite, veuillez réessayer plus tard.", color: "error"});
		})
	}

	playerRow(player) {
		let action = [
			{title: "Suivre", color: "var(--friend-bg)", hover: "var(--friend-bg-h)", action: this.followPlayer},
			{title: "Ne plus suivre", color: "#555555", hover: "#8e8e8e", action: this.unfollowPlayer}
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
							class: "friend-name", children: link({to: "/user/"+player.id, title: player.nickname, children: player.nickname, class: ismax(player.id)})
						}),
						createElement('div', {
							class: "friend-status"+(player.is_online ?  " on" : " off"), children: player.status || "Hors ligne"
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
					}),
					createElement('div', {
						class: "friend-container", children: [
							createElement('div', {
								class: "friend-search", style: (this.state.open ? "width: 450px" : ""), children: [
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
												class: "friend-search-label", children: "Amis"
											})
										]
									}),
									this.state.open ?
									!this.state.onsearch && createElement('div', {
										class: "friend-count", children: ((this.state.following.filter(e => e.is_online).length)+"/"+this.state.following.length)
									})
									:
									createElement('div', {
										class: "friend-count", children: "Amis"
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