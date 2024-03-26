
let LoadManager = function() {
	if (!(this instanceof LoadManager)) {
		throw new Error("LoadManager is a constructor and should be called with the new keyword");
	}
}
LoadManager.prototype = {
	loaded: 0,
	total: 0,
	onload: function() {},
	add: function(func, proto) {
		console.log(func, proto, typeof func, typeof proto);
		if (typeof func !== "object" && typeof func !== "function") {
			throw new Error("LoadManager.add() expects a function as argument");
		}
		if (typeof proto !== "string") {
			throw new Error("LoadManager.add() expects a string as second argument");
		}
		let t = this;
		t.total++;
		let c = () => {
			t.loaded++;
			if (t.loaded === t.total) {
				t.onload();
			}
		};
		if (!func[proto]) {
			func[proto] = c.bind(func);
		} else {
			func[proto].call(func, c);
		}
		return (this);
	},
}

export default LoadManager;