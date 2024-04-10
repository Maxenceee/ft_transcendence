let Cookies =  {
	get: function(name) {
		let cookies = {};
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let cookie = ca[i].trim().split('=');
			let name = cookie[0];
			let value = cookie[1];
			cookies[name] = value;
		}
		return cookies[name] || "";
	}
};

export default Cookies;