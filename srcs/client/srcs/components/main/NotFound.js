import { createElement, Component, link } from '..';

class NotFound extends Component {
	render() {
		return createElement("div", {children: [
				createElement("p", {children:
					"Page not found"
				}),
				link({to: "/", class: "link", children: "Go back to home"})
			]
		});
	}
}

export default NotFound;