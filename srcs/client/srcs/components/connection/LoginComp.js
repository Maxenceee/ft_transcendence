import { Component, createElement } from '..';
import Input from './Input';

class LoginComp extends Component {
	constructor(props) {
		super(props);
		this.state = {login: "", password: ""};
		// this.username_ref = {current: null};
		// this.password_ref = {current: null};
	}

	render() {
		return createElement('div', {
			children: [
				createElement('div', {
					class: "auth-form-input", children: [
						createElement(Input, {
							ref: this.props.username_ref, label: "Nom d'utilisateur", id: "identifierU", autocomplete: "current-username", name: "login"
						}),
						createElement(Input, {
							ref: this.props.password_ref, label: "Mot de passe", id: "identifierP", autocomplete: "current-password", name: "password"
						}),
						createElement('input', {
							type: "submit", value: "Se connecter", class: "auth-form-submit btn-primary", "data-disable-with": "Création…", "data-signin-label": "Se connecter", "data-sso-label": "Connectez-vous pour accéder à la ressource"
						})
					]
				}),
				createElement('div', {
					class: "auth-form-other-l", children: createElement('p', {
						children: [
							"Nouveau ici ? ",
							createElement('span', {
								children: "Créer un compte", onclick: this.props.toggle_mode
							})
						]
					})
				})
			]
		})
	}
}

export default LoginComp