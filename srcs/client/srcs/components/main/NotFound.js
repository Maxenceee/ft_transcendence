import { createElement, Component, link } from '..';

class NotFound extends Component {
	render() {
		return createElement("div", {
			class: "not-found-container", children: [
				createElement('img', {
					src: "http://localhost:3000/static/images/404_img.png", alt: "404"
				}),
				// link({to: "/", class: "link", children: "Go back to home"})
			]
		});
	}
}

export default NotFound;