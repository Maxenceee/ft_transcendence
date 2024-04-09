import { Component, createElement, Loader, useParams, navigate } from '..';

import { colors } from './render/TwoFourGameRender';

class GamePlayersOverlay extends Component {
	parseColor(color) {
		if (typeof color === 'number') {
			color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
		}
		return color;
	};

	render() {
		return this.props.players.length == 2 ?
		createElement('div', {
			class: "game-player-overlay", children: createElement('div', {
				class: "game-player-overlay-cnt", children: [
					createElement('div', {
						class: "game-player-profile", children: [
							createElement('h1', {
								children: this.props.players[0].nickname,
							}),
							createElement('img', {
								src: this.props.players[0].profile_picture
							}),
						]
					}),
					createElement('div', {
						class: "game-player-separator", children: "VS"
					}),
					createElement('div', {
						class: "game-player-profile", children: [
							createElement('img', {
								src: this.props.players[1].profile_picture
							}),
							createElement('h1', {
								children: this.props.players[1].nickname,
							}),
						]
					})
				]
			})
		})
		:
		createElement('div', {
			class: "game-player-overlay", children: createElement('div', {
				class: "game-player-overlay-cnt", children: this.props.players.map((player, i) => {
					return [
						createElement('div', {
							class: "game-player-profile", children: [
								createElement('h1', {
									children: player.nickname, style: `color: ${this.parseColor(colors[i])};`
								}),
							]
						}),
						(i < this.props.players.length -1) && createElement('div', {
							class: "game-player-separator", children: "VS"
						})
					]
				}).flat()
			})
		})
	}
}

export default GamePlayersOverlay;