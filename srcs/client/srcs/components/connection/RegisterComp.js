import { Component, createElement } from '..';
import Input from './Input';

class RegisterComp extends Component {
	constructor(props) {
		super(props);
		this.state = {login: "", password: ""};
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
							type: "submit", value: "Créer mon compte", class: "auth-form-submit btn-primary", "data-disable-with": "Création…", "data-signin-label": "Créer mon compte", "data-sso-label": "Créer un compte pour accéder à la ressource"
						})
					]
				}),
				createElement('div', {
					class: "auth-form-other-l", children: createElement('p', {
						children: [
							"Déjà un compte ? ",
							createElement('span', {
								children: "Se connecter", onclick: this.props.toggle_mode
							})
						]
					})
				}),
			]
		})
	}
}

export default RegisterComp