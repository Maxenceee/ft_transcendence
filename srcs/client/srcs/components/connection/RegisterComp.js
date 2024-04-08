import { Component, createElement, link } from '..';

class RegisterComp extends Component {
	constructor(props) {
		super(props);
		this.state = {login: "", password: ""};
		this.formref = {current: null};
		this.onInput = this.onInput.bind(this);
	}

	// onInput(e) {
	// 	this.setState({[e.target.name]: e.target.value});
	// }

	// componentDidUpdate() {
	// 	console.log(this.state);
	// 	if (this.state.inedition && this.ref.current) {
	// 		this.ref.current.focus();
	// 		this.ref.current.setSelectionRange(this.ref.current.value.length, this.ref.current.value.length);
	// 	}
	// }

	render() {
		return createElement('div', {
			class: "auth-form-body", children: [
				createElement('h1', {
					children: "Créer un compte"
				}),
				createElement('form', {
					ref: this.formref, "data-turbo": "false", "accept-charset": "UTF-8", children: [
						createElement('div', {
							class: "auth-form-input", children: [
								createElement('div', {
									class: "ttpo form-input", children: createElement('label', {
										class: "f0n8F"+(this.state.login.length ? " FATdn" : ""), children: [
											createElement('span', {
												class: "_9nyy2", children: "Nom d'utilisateur"
											}),
											createElement('input', {
												class: "_2hvTZ pexuQ zyHYP", id: "identifierU", autocomplete: "current-username", minlength: "3", maxlength: "20", autocorrect: "off", autocapitalize: "off", required: "", type: "text", "aria-required": "true", name: "login", value: this.state.login, oninput: this.onInput
											})
										]
									})
								}),
								createElement('div', {
									class: "ttpo form-input", children: createElement('label', {
										class: "f0n8F"+(this.state.password.length ? " FATdn" : ""), children: [
											createElement('span', {
												class: "_9nyy2", children: "Mot de passe"
											}),
											createElement('input', {
												class: "_2hvTZ pexuQ zyHYP", id: "identifierP", autocomplete: "current-password", minlength: "3", maxlength: "20", autocorrect: "off", autocapitalize: "off", required: "", type: "password", "aria-required": "true", "aria-label": "password", name: "password", value: this.state.password, oninput: this.onInput
											})
										]
									})
								}),
								createElement('input', {
									type: "submit", value: "Créer mon compte", class: "auth-form-submit btn-primary", "data-disable-with": "Création…", "data-signin-label": "Créer mon compte", "data-sso-label": "Créer un compte pour accéder à la ressource"
								})
							]
						}),
						createElement('div', {
							class: "auth-form-other-l", children: createElement('p', {
								children: [
									"Déjà un compte ? ",
									link({
										to: "/login", children: "Se connecter"
									})
								]
							})
						}),
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
										id: "swivel-ref-h", class: "external-connect-btn"
									})
								]
							})
						})
					]
				})
			]
		})
	}
}

export default RegisterComp