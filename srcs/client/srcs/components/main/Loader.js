import { Component, createElement } from '..';

class Loader extends Component {
	render() {
		return createElement('div', {
			class: "ad-up-box-loader", children: [
				createElement('div', {
					class: "loader", children: [
						createElement('div', {
							class: "player_one"
						}),
						createElement('div', {
							class: "player_two"
						}),
						createElement('div', {
							class: "ball"
						})
					]
				}),
				createElement('div', {
					class: "ad-up-box-loader-text", children: createElement('span', {
						class: "ad-up-box-loader-text", children: "Bouge pas, ça charge..."
					})
				})				
			]
		})		
	}
}

export default Loader;