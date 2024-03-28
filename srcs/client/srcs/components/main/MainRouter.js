import { Component, createElement, HomePage, UserPage, NotFound, FriendsPanel, router, route, link } from '..';

class MainRouter extends Component {
	componentDidMount() {
		// console.log("componentDidMount MainRouter", this);
	}

	render() {
		return createElement('div', {
			class: "home", children: [
				createElement('div', {
					class: "nav-bar", children: createElement('nav', {
						children: [
							createElement('div', {
								class: "nav-container", children: [
									link({
										to: "/", children: createElement('div', {
											class: "icon-container", children: createElement('svg', {
												class: "icon", width: "29", height: "28", viewBox: "0 0 29 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
													d: "M17.3688 22.7488H11.2228V15.1419C11.2228 14.5944 11.5903 14.2386 12.1378 14.2386H16.4655C17.013 14.2386 17.3688 14.5944 17.3688 15.1419V22.7488ZM3.78914 22.3431C3.78914 24.0268 4.84734 25.0447 6.58194 25.0447H22.0364C23.771 25.0447 24.8175 24.0268 24.8175 22.3431V13.4141L15.0286 5.20275C14.5727 4.81931 14.0306 4.82892 13.5844 5.20275L3.78914 13.4141V22.3431ZM0 11.814C0 12.4189 0.455153 12.935 1.19765 12.935C1.56163 12.935 1.886 12.7466 2.17217 12.5115L13.8119 2.7458C14.1267 2.46713 14.4958 2.46713 14.8127 2.7458L26.4462 12.5115C26.7248 12.7466 27.0492 12.935 27.4132 12.935C28.0863 12.935 28.6012 12.5171 28.6012 11.8428C28.6012 11.447 28.4482 11.1409 28.1515 10.8878L15.9544 0.635973C14.9522 -0.211991 13.6821 -0.211991 12.6703 0.635973L0.459372 10.8899C0.153045 11.1451 0 11.4875 0 11.814ZM21.547 6.13864L24.8576 8.92464V3.26801C24.8576 2.73973 24.521 2.40317 23.9927 2.40317H22.414C21.8953 2.40317 21.547 2.73973 21.547 3.26801V6.13864Z"
												})
											})
										})
									}),
									link({
										to: "/user/me", children: createElement('div', {
											class: "icon-container", children: createElement('svg', {
												class: "icon", width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: createElement('path', {
													d: "M14.105 26.21C20.7369 26.21 26.2121 20.7273 26.2121 14.105C26.2121 7.47312 20.7273 2 14.0954 2C7.47523 2 2 7.47312 2 14.105C2 20.7273 7.48484 26.21 14.105 26.21ZM14.105 23.8255C8.71085 23.8255 4.39412 19.4991 4.39412 14.105C4.39412 8.71085 8.70124 4.38452 14.0954 4.38452C19.4895 4.38452 23.8276 8.71085 23.8276 14.105C23.8276 19.4991 19.4991 23.8255 14.105 23.8255ZM21.9181 21.8361L21.8766 21.6418C21.14 19.9212 18.196 18.1442 14.105 18.1442C10.0257 18.1442 7.07959 19.9212 6.33545 21.6322L6.29397 21.8361C8.49826 23.8651 11.8683 24.9826 14.105 24.9826C16.3534 24.9826 19.6946 23.8747 21.9181 21.8361ZM14.105 16.2132C16.3794 16.2324 18.1414 14.2979 18.1414 11.7847C18.1414 9.4196 16.3655 7.4478 14.105 7.4478C11.8466 7.4478 10.059 9.4196 10.0707 11.7847C10.0803 14.2979 11.8423 16.194 14.105 16.2132Z"
												})
											})
										})
									})
								]
							}),
							createElement('div', {
								class: "nav-bottom", children: createElement('a', {
									href: "/logout", children: createElement('div', {
										class: "icon-container", children: createElement('svg', {
											class: "icon", width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
												createElement('path', {
													d: "M7.41333 16.5205V23.4008C7.41333 25.3365 8.76661 26.6312 10.7865 26.6312H19.9953C21.9856 26.6312 23.3135 25.3365 23.3135 23.3987V4.23249C23.3135 2.29258 21.9856 1 19.9953 1H10.7865C8.76661 1 7.41333 2.29258 7.41333 4.23038V11.1309H9.71136V4.75866C9.71136 3.86545 10.2411 3.36131 11.1802 3.36131H19.5605C20.4879 3.36131 21.0176 3.86967 21.0176 4.76076V22.8705C21.0176 23.7615 20.4879 24.2699 19.5605 24.2699H11.1802C10.2411 24.2699 9.71136 23.7658 9.71136 22.8726V16.5205H7.41333Z"
												}),
												createElement('path', {
													d: "M4.99257 14.7958H12.6859L14.9498 14.6807L12.644 16.7265L11.9992 17.3755C11.8279 17.5607 11.7013 17.8213 11.7013 18.099C11.7013 18.6533 12.1098 19.0384 12.647 19.0384C12.9215 19.0384 13.1694 18.9362 13.3525 18.7511L17.4934 14.6144C17.755 14.3624 17.8858 14.0807 17.8858 13.8161C17.8858 13.5494 17.755 13.2505 17.4934 13.0061L13.3525 8.87895C13.1694 8.69379 12.9215 8.59161 12.647 8.59161C12.1098 8.59161 11.7013 8.97668 11.7013 9.52348C11.7013 9.81082 11.8237 10.0597 11.9992 10.2449L12.644 10.9056L14.9498 12.9419L12.6859 12.8247H4.99257C4.39562 12.8247 4 13.2918 4 13.8161C4 14.3383 4.39562 14.7958 4.99257 14.7958Z"
												})
											]
										})
									})
								})
							})
						]
					})
				}),
				createElement('header', {children: createElement(FriendsPanel, {following: this.props.user.following})}),
				createElement('main', {children:
					router(
						route({path: "/", element: createElement(HomePage, {user: this.props.user, reload: this.props.reload})}),
						route({path: "/user/:id", element: createElement(UserPage, {user: this.props.user, reload: this.props.reload})}),
						route({path: "*", element: createElement(NotFound)})
					)
				})
			]
		})
	}
}

export default MainRouter;