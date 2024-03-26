import { Component, createElement } from '..';

class FriendsPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		}

		this.openFriendsPanel = this.openFriendsPanel.bind(this);
	}

	openFriendsPanel() {
		this.setState({open: !this.state.open});
	}

	render() {
		return createElement('div', {
			class: "friend-button", onclick: this.openFriendsPanel, children: [
				createElement('div', {
					class: "friend-icon", children: createElement('svg', {
						class: "icon", width: "14", height: "10", viewBox: "0 0 14 10", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
							d: "M1.54037 2.14763H12.6908C13.2676 2.14763 13.6826 1.78153 13.6826 1.2249C13.6826 0.675756 13.2676 0.307556 12.6908 0.307556H1.54037C0.951857 0.307556 0.546387 0.675756 0.546387 1.2249C0.546387 1.78153 0.951857 2.14763 1.54037 2.14763ZM1.54037 6.01598H12.6908C13.2676 6.01598 13.6826 5.64988 13.6826 5.09328C13.6826 4.54408 13.2676 4.17588 12.6908 4.17588H1.54037C0.951857 4.17588 0.546387 4.54408 0.546387 5.09328C0.546387 5.64988 0.951857 6.01598 1.54037 6.01598ZM1.54037 9.89398H12.6908C13.2676 9.89398 13.6826 9.51828 13.6826 8.97118C13.6826 8.42208 13.2676 8.05388 12.6908 8.05388H1.54037C0.951857 8.05388 0.546387 8.42208 0.546387 8.97118C0.546387 9.51828 0.951857 9.89398 1.54037 9.89398Z"
						})
					})
				}),
				createElement('div', {
					class: "friend-container" + (this.state.open ? " open" : ""), children: [
						createElement('div', {
							class: "friend-search", children: [
								createElement('div', {
									class: "friend-search-header"
								}),
								createElement('div', {
									class: "friend-count", children: "2/3"
								})
							]
						})
					]
				})
			]
		})
	}
}

export default FriendsPanel;