import { Component, createElement, Loader, useParams, navigate } from '..';

class KeyBindsView extends Component {
	render() {
		return createElement('div', {
			class: "game-keyboard", children: [
				createElement('div', {
					class: "game-keyboard-shortcut", children: [
						this.props.type != "local" && createElement('div', {
							class: "key", children: [
								"E",
								createElement('p', {
									children: "Vue joueur"
								})
							]
						}),
						this.props.type != "4p" && createElement('div', {
							class: "key", children: [
								"R",
								createElement('p', {
									children: "Vue Pong"
								})
							]
						}),
						this.props.type == "tournament" && createElement('div', {
							class: "key", children: [
								"T",
								createElement('p', {
									children: "Vue globale"
								})
							]
						}),
					]
				}),
				createElement('div', {
					class: "game-keyboard-moves"+(this.props.type == "4p" ? " nogrid" : this.props.type == "local" ? " col" : ""), children: [
						this.props.type == "local" && createElement('div', {
							class: "key", children: [
								"W",
								createElement('p', {
									children: "Haut"
								})
							]
						}),
						this.props.type != "4p" && createElement('div', {
							class: "key", children: [
								"↑",
								createElement('p', {
									children: "Haut"
								})
							]
						}),
						this.props.type == "local" && createElement('div', {
							class: "key", children: [
								"S",
								createElement('p', {
									children: "Bas"
								})
							]
						}),
						this.props.type != "local" && createElement('div', {
							class: "key", children: [
								"←",
								createElement('p', {
									children: "Gauche"
								})
							]
						}),
						this.props.type != "4p" && createElement('div', {
							class: "key", children: [
								"↓",
								createElement('p', {
									children: "Bas"
								})
							]
						}),
						this.props.type != "local" && createElement('div', {
							class: "key", children: [
								"→",
								createElement('p', {
									children: "Droite"
								})
							]
						})
					]
				})
			]
		});
	}
}

export default KeyBindsView;