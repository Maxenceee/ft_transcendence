import { createElement, Component, link } from '..';

class ServerError extends Component {
	render() {
		return createElement('div', {
            class: "server-error", children: [
                createElement('div', {
                    class: "logo", children: createElement('img', {
                        src: "/static/images/42_logo.svg", alt: "logo"
                    })
                }),
                createElement('div', {
                    class: "title", children: link({
                            to: "/", children: createElement('img', {
                            src: "/static/images/500.png", alt: ""
                        })
                    })
                }),
                createElement('div', {
                    class: "screen", children: [
                        createElement('div', {
                            class: "main-image", style: "background-image: url(https://cdn.maxencegama.dev/placeholder/u/pl/random/sorry/placeholder);"
                        }),
                        createElement('img', {
                            src: "/static/images/macbook.png", alt: ""
                        })
                    ]
                }),
                createElement('h1', {
                    children: "Ooops ! Something went wrong !"
                })
            ]
        });        
	}
}

export default ServerError;