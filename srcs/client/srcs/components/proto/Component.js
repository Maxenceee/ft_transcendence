class Component {
	constructor(props) {
		this.props = props || {};
		this.state = {};
		this._pendingState = null;
		this._pendingStateCallbacks = [];
		this._element = null;
		this._data = null;
		this._parent = null;
		this._mounted = false;
		this._moised = null;
		this._owner = null;

		this._unmountComponent = this._unmountComponent.bind(this);
	}

	setState(newState, callback) {
		this._pendingState = Object.assign({}, this.state, newState);
		if (callback) {
			this._pendingStateCallbacks.push(callback);
		}
		this._updateComponent();
	}

	_renderComponent() {
		let render = this.render();
		if (render == undefined) throw new Error('Render method must return a value');
		this._mounted = true;
		this._data = render;
		this._element = typeof render == "object" ? render._renderComponent() : document.createTextNode(render);
		this.componentDidMount();
		return this._element;
	}

	_updateComponent() {
		let node;
		if (!this._pendingState || !this._mounted) return;
		
		this.state = this._pendingState;
		this._pendingState = null;

		const oldElement = this._data || null;
		const oldElementData = oldElement && oldElement.element || null;
		if (oldElement) {
			oldElement._unmountComponent();
		}
		let newElement = this.render();
		this._data = newElement;
		this._element = newElement._renderComponent()
		if ((node = (this._parent || (oldElementData && oldElementData.parentNode)))) {
			if (newElement && oldElementData) {
				node.replaceChild(newElement.element, oldElementData);
				this._parent = newElement.element.parentNode
			} else if (newElement) {
				node.appendChild(newElement.element);
				this._parent = newElement.element.parentNode
			} else {
				node.removeChild(oldElementData);
			}
		}

		this._pendingStateCallbacks.forEach(callback => callback(this.state));
		this._pendingStateCallbacks = [];

		if (this._mounted)
			this.componentDidUpdate();
	}

	_unmountComponent() {
		if (!this._mounted) return;
		this._mounted = false;
		this.componentWillUnmount();
		this._data && typeof this._data._unmountComponent === "function" && this._data._unmountComponent();
		this._data = null;
		this._element = null;
		this._parent = null;
    }

	render() {
		throw new Error('Render method must be implemented');
	}

	get element() {
		return this._data && this._data.element || this._element;
	}

	set element(e) {}

	componentDidMount() {}

	componentDidUpdate() {}

	componentWillUnmount() {}
}

export default Component;

export function ismax(id, t = false) {
	return (id == "maxence" && ("flag" + (t ? " withbg" : "")) || "");	
}