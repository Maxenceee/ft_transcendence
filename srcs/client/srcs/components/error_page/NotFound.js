import { createElement, Component, link } from '..';

class NotFound extends Component {
	render() {
		return createElement("div", {
			class: "not-found-container", children: [
				createElement('img', {
					src: process.env.BASE_URI+"/static/images/404_img.png", alt: "404"
				}),
			]
		});
	}
}

export default NotFound;