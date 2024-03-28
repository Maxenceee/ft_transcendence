import { Component, createElement, UserPagePlayerHistory, UserPagePlayerStats, navigate, Loader, useParams, xhr } from '../..';

class UserPage extends Component {
	constructor(props) {
		super(props);
		this.state = { loading: false, user: props.user };
	}

	componentDidMount() {
		let a = useParams("/user/:id") ?? {params: {id: null}},
			{ id } = a.params;
		if (!id) {
			navigate("/");
		}
		if (id != "me" && id != this.state.user.id) {
			this.setState({ loading: true });
			xhr.get('/api/user/'+id+'/get')
			.then(res => res.data)
			.then(data => {
				this.setState({ user: data, loading: false });
			})
			.catch(error => {
				console.error("error", error);
				this.setState({ loading: false });
			})
		}
		// console.log("this.componentDidMount UserPage Page");
	}

	componentDidUpdate() {
		// console.log("this.componentDidUpdate UserPage Page");
	}

	componentWillUnmount() {
		// console.log("this.componentWillUnmount UserPage Page");
	}

	render() {
		return this.state.loading ?
		createElement(Loader)
		:
		createElement('div', {
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
											}),
											this.state.user.id != this.props.user.id && createElement('div', {
												class: "card-action", children: [
													createElement('button', {
														class: "action-button", children: "Follow (not working here yet bc of server)", style: "--friend-action-color: var(--friend-bg); --friend-action-color-h: var(--friend-bg-h);"
													})
												]
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