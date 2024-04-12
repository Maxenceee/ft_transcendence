import { Component, createElement, navigate } from '..';
import axios from 'axios';
import LoginComp from './LoginComp';
import RegisterComp from './RegisterComp';
import SwivelButton from '../auth/SwivelButton';

class InputSection extends Component {
	constructor(props) {
		super(props);
		this.state = { username: "", register: false, invalid: false, exists: false, error: null }
		this.ref = {current: null};
		this.formref = {current: null};
		this.username_ref = {current: null};
		this.password_ref = {current: null};
	
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		let data = new FormData(this.formref.current);
		this.password_ref.current.value = "";
		axios.post(this.state.register ? '/signup' : '/login', data)
		.then(res => res.data)
		.then(data => {
			if (data.user && data.authenticated) {
				return navigate('/');
			}
			if (!data.user || !data.authenticated) {
				this.setState({invalid: true, exists: false});
			} else if (data.exists) {
				this.setState({invalid: false, exists: true});
			}
		})
		.catch(error => {
			this.setState({error: "Une erreur est survenue. Veuillez réessayer plus tard.", invalid: false, exists: false});
		})
	}

	render() {
		return createElement('section', {
			children: createElement('div', {
				class: "semi", children: createElement('div', {
					class: "cntc", children: createElement('div', {
						class: "auth-form", children: createElement('div', {
							class: "auth-form-body", children: [
								this.state.invalid && createElement('div', {
									children: createElement('div', {
										class: "auth-unauthorized", children: createElement('div', {
											class: "in", children: createElement('div', {
												"aria-atomic": "true", role: "alert", children: [
													createElement('strong', {
														children: "Nom d'utilisateur"
													}),
													" ou ",
													createElement('strong', {
														children: "Mot de passe"
													}),
													" incorrect."
												]
											})
										})
									})
								}),
								this.state.exists && createElement('div', {
									children: createElement('div', {
										class: "auth-unauthorized", children: createElement('div', {
											class: "in", children: createElement('div', {
												"aria-atomic": "true", role: "alert", children: "Ce nom d'utilisateur n'est pas disponible."
											})
										})
									})
								}),
								this.state.error && createElement('div', {
									children: createElement('div', {
										class: "auth-unauthorized", children: createElement('div', {
											class: "in", children: createElement('div', {
												"aria-atomic": "true", role: "alert", children: this.state.error
											})
										})
									})
								}),
								createElement('h1', {
									children: this.state.register ? "Créer un compte" : "Connexion"
								}),
								createElement('form', {
									ref: this.formref, onsubmit: this.onSubmit, "data-turbo": "false", "accept-charset": "UTF-8", children: [
										this.state.register ?
										createElement(RegisterComp, {toggle_mode: () => this.setState({register: !this.state.register}), username_ref: this.username_ref, password_ref: this.password_ref})
										:
										createElement(LoginComp, {toggle_mode: () => this.setState({register: !this.state.register}), username_ref: this.username_ref, password_ref: this.password_ref}),
										createElement('div', {
											class: "card-separator upper-text"
										}),
										createElement('div', {
											class: "external-connect", children: createElement('div', {
												children: [
													createElement('div', {
														id: "intra-button", class: "external-connect-btn intra-button", children: [
															createElement('img', {
																class: "icon", src: "/static/images/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png", alt: "icon-42"
															}),
															createElement('div', {
																class: "inner", children: "Sign in with 42 Intra"
															})
														]
													}),
													createElement('div', {
														ref: this.ref, class: "external-connect-btn", children: createElement(SwivelButton, {
															client_id: process.env.SWIVEL_CLIENT_ID,
															redirect_uri: window.location.origin,
															callback: window.location.origin.concat("/callback/swivel"),
															scope: "user:profile",
															disable_colormode: true
														})
													})
												]
											})
										})
									]
								})
							]
						})
					})
				})
			})
		})}
}

class ConnectionPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return createElement('main', {
			children: createElement('div', {
				class: "connection-page", children: [
					createElement('video', {
						class: "video-player", autoplay: "", loop: "", muted: "", poster: "/static/images/pong_visual_1.png", children: createElement('source', {
							src: "/static/videos/0001-0151.mp4", type: "video/mp4"
						})
					}),
					createElement(InputSection)
				]
			})
		})		
	}
}

export default ConnectionPage;