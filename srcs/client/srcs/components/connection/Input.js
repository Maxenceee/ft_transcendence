import { Component, createElement } from '..';

class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {value: ""};
		this.onInput = this.onInput.bind(this);
	}

	onInput(e) {
		this.setState({value: e.target.value});
	}

	componentDidUpdate() {
		if (this.props.ref.current) {
			this.props.ref.current.focus();
			this.props.ref.current.setSelectionRange(this.props.ref.current.value.length, this.props.ref.current.value.length);
		}
	}

	render() {
		return createElement('div', {
			class: "ttpo form-input", children: createElement('label', {
				class: "f0n8F"+(this.state.value.length ? " FATdn" : ""), children: [
					createElement('span', {
						class: "_9nyy2", children: this.props.label
					}),
					createElement('input', {
						ref: this.props.ref, class: "_2hvTZ pexuQ zyHYP", id: this.props.id, autocomplete: this.props. autocomplete, minlength: "3", maxlength: "20", autocorrect: "off", autocapitalize: "off", required: "", type: "text", "aria-required": "true", name: this.props.name, value: this.state.value, oninput: this.onInput
					})
				]
			})
		})
	}
}

export default Input;