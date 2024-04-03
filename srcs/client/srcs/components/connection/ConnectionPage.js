import { Component, createElement } from '..';
import axios from 'axios';
import LoginComp from './LoginComp';
import RegisterComp from './RegisterComp';

class ConnectionPage extends Component {
	constructor(props) {
		super(props);
		this.state = { register: false }
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
					createElement('section', {
						children: createElement('div', {
							class: "semi", children: createElement('div', {
								class: "cntc", children: createElement('div', {
									class: "auth-form", children: createElement(RegisterComp)
								})
							})
						})
					})
				]
			})
		})		
	}
}

export default ConnectionPage