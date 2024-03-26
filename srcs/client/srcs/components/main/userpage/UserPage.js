import { Component, createElement, UserPagePlayerHistory, UserPagePlayerStats } from '../..';

class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
	}

	componentDidMount() {
		console.log("this.componentDidMount UserPage Page");
	}

	componentDidUpdate() {
		console.log("this.componentDidUpdate UserPage Page");
	}

	componentWillUnmount() {
		console.log("this.componentWillUnmount UserPage Page");
	}

	render() {
		return createElement('div', {
			children: createElement('div', {
				class: "data", children: [
					createElement('div', {
						class: "featured-bar", children: createElement('div', {
							class: "featured-bar-margin", children: createElement('div', {
								class: "featured-bar-content", children: createElement('div', {
									class: "featured-bar-primary-row", children: createElement('div', {
										class: "feature-title"
									})
								})
							})
						})
					}),
					createElement('section', {
						class: "player-profile", children: createElement('div', {
							class: "oa-container", children: createElement('div', {
								class: "player-container", children: [
									createElement('div', {
										class: "player-card", children: [
											createElement('div', {
												class: "card-header", children: createElement('h2', {
													children: this.state.user.nickname
												})
											}),
											createElement('div', {
												class: "card-picture", children: createElement('img', {
													src: this.state.user.profile_picture, alt: "profile-picture"
												})
											})
										]
									}),
									createElement('div', {
										class: "card-container", children: [
											createElement('div', {
												class: "stat-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Statistics"
														})
													}),
													createElement(UserPagePlayerStats, {user: this.state.user})
												]
											}),
											createElement('div', {
												class: "history-card page-card", children: [
													createElement('div', {
														class: "card-title", children: createElement('h2', {
															children: "Game History"
														})
													}),
													createElement(UserPagePlayerHistory, {user: this.state.user}),
												]
											})
										]
									})
								]
							})
						})
					})
				]
			})
		});		
	}
}

export default UserPage;