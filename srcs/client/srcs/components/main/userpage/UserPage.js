import { Component, createElement, UserPagePlayerHistory, UserPagePlayerStats, navigate, Loader, useParams } from '../..';
import axios from "axios";
import { ismax } from '../../proto/Component';

class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: false, user: props.user };
	}

	componentDidMount() {
		let a = useParams("/user/:id") ?? {params: {id: null}},
			{ id } = a.params;
		if (!id) {
			return navigate("/");
		}
		if (id != "me" && id != this.state.user.id) {
			this.setState({ loading: true });
			axios.get('/api/user/'+id+'/get')
			.then(res => res.data)
			.then(data => {
				this.setState({ user: data, loading: false });
			})
			.catch(error => {
				console.error("error", error);
				this.setState({ loading: false });
			})
		}
	}

	render() {
		return this.state.loading ?
		createElement(Loader)
		:
		createElement('div', {
			children: createElement('div', {
				class: "data", children: [
					createElement('section', {
						class: "player-profile", children: createElement('div', {
							class: "oa-container", children: createElement('div', {
								class: "player-container", children: [
									createElement('div', {
										class: "player-card", children: [
											createElement(UserNicknameField, {me: this.props.user.id == this.state.user.id, id: this.state.user.id, nickname: this.state.user.nickname, username: this.state.user.username, reload: this.props.reload}),
											createElement(UserProfilePicture, {me: this.props.user.id == this.state.user.id, user: this.state.user, reload: this.props.reload})
										]
									}),
									createElement('div', {
										class: "card-container", children: [
											createElement('div', {
												class: "stat-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Statistiques"
														})
													}),
													createElement(UserPagePlayerStats, {user: this.state.user})
												]
											}),
											createElement('div', {
												class: "history-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Historique"
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

class UserNicknameField extends Component {
	constructor(props) {
		super(props);
		this.state = { nickname: props.nickname, inedition: false };
		this.ref = { current: null };

		this.updateNickeName = this.updateNickeName.bind(this);
	}

	componentDidUpdate() {
		if (this.state.inedition && this.ref.current) {
			this.ref.current.focus();
			this.ref.current.setSelectionRange(this.ref.current.value.length, this.ref.current.value.length);
		}
	}

	updateNickeName() {
		if (this.state.nickname == this.props.nickname) {
			return this.setState({ inedition: false });
		}
		axios.post('/api/user/update/nickname', { nickname: this.state.nickname })
		.then(res => res.data)
		.then(data => {
			this.props.reload(null, false);
		})
		.catch(error => {
			console.error("error", error);
		})
	}

	validinput() {
		return this.state.nickname.length >= 3 && this.state.nickname.length <= 20;
	}

	render() {
		return createElement('div', {
			class: "card-header", children: [
				createElement('div', {
					class: "flex relative", children: this.props.me && this.state.inedition ?
					[
						createElement('div', {
							class: "nickname-input", children: createElement('input', {
								ref: this.ref, value: this.state.nickname, placeholder: "Surnom", oninput: e => this.setState({nickname: e.target.value}), autocomplete:"off", minlength: "3", maxlength: "20", autocorrect: "off", autocapitalize: "off", type:"text"
							})
						}),
						this.validinput() && createElement('div', {
							class: "nickname-input-action", onclick: this.updateNickeName, children: createElement('svg', {
								class: "icon", width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
									d: "M11.9254 24.8903C12.5347 24.8903 13.0155 24.636 13.3494 24.1265L24.3646 6.95472C24.6114 6.56847 24.7103 6.24527 24.7103 5.92723C24.7103 5.12028 24.1429 4.56342 23.3275 4.56342C22.7491 4.56342 22.4132 4.75795 22.0623 5.30872L11.8785 21.4877L6.6306 14.74C6.28912 14.2877 5.93077 14.0983 5.42452 14.0983C4.58781 14.0983 4 14.684 4 15.493C4 15.8406 4.12984 16.1917 4.42211 16.5468L10.4936 24.1431C10.8979 24.6487 11.335 24.8903 11.9254 24.8903Z"
								})
							})
						}),
					]
					:
					[
						createElement('h2', {
							class: ismax(this.props.id), children: this.state.nickname
						}),
						this.props.me && createElement('div', {
							class: "nickname-action", onclick: () => this.setState({inedition: true}), children: createElement('svg', {
								class: "icon", height: "16", viewBox: "0 0 16 16", width: "16", "aria-hidden": "true", children: createElement('path', {
									d: "M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"
								})
							})
						})
					],
				}),
				this.props.username && createElement('h3', {
					children: this.props.username
				}),
			]
		});
	}
}

class UserProfilePicture extends Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
		this.ref = { current: null };

		this.removeProfilePicture = this.removeProfilePicture.bind(this);
		this.uploadProfilePicture = this.uploadProfilePicture.bind(this);
	}

	removeProfilePicture() {
		axios.post('/api/user/delete/picture')
		.then(res => res.data)
		.then(data => {
			this.props.reload(null, false);
		})
		.catch(error => {
			console.error("error", error);
			this.setState({ loading: false });
		});
	}

	uploadProfilePicture(e) {
		const formData = new FormData(this.ref.current);
		this.setState({ loading: true });
		axios.post('/api/user/update/picture', formData, {headers: { "Content-Type": "multipart/form-data" }})
		.then(res => res.data)
		.then(data => {
			this.props.reload(null, false);
		})
		.catch(error => {
			console.error("error", error);
			this.setState({ loading: false });
		});
	}

	dropdown() {
		return createElement('div', {
			class: "dropdown", children: [
				createElement('div', {
					class: "dropdown-item", children: createElement('label', {
						for: "avatar_upload", children: "Téléverser une photo"
					})
				}),
				!this.props.user.default_profile_picture && createElement('div', {
					class: "dropdown-item", onclick: this.removeProfilePicture, children: "Supprimer la photo"
				}),
			]
		})
	}

	render() {
		return createElement('div', {
			class: "card-profile", children: [
				createElement('div', {
					class: "card-picture"+(this.state.loading ? " loading" : ""), children: createElement('img', {
						src: this.props.user.profile_picture, alt: "profile-picture"
					})
				}),
				this.props.me &&
				[
					createElement('div', {
						class: "card-picture-action", onclick: () => this.setState({open: !this.state.open}), children: createElement('svg', {
							class: "icon", height: "16", viewBox: "0 0 16 16", width: "16", "aria-hidden": "true", children: createElement('path', {
								d: "M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"
							})
						})					
					}),
					createElement('form', {
						ref: this.ref, class: "card-upload-form", children: createElement('input', {
							type: "file", name: "profile_picture", id: "avatar_upload", accept: "image/*", hidden: true, onchange: this.uploadProfilePicture
						})
					}),
					this.state.open && this.dropdown()
				]
			].flat()
		})
	}
}

export default UserPage;