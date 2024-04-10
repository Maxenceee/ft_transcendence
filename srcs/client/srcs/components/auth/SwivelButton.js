import Component from "../proto/Component";

class SwivelButton extends Component {
	constructor(props) {
		super(props);

		this.ref = { current: null };

		let state = (function() {
			let t = {
				return_to: encodeURIComponent(props.redirect_uri),
			}
			let n = function(t) {
				try {
					var e = JSON.stringify(t);
					return window.btoa(e)
				} catch (r) {}
				return ""
			}
			return (n(t));
		})();
		this.authPath.concat("?client_id=", props.client_id, "&state=", state, "&response_type=token&redirect_uri=", props.callback, "&scope=", props.scope);
		if (!props.disable_colormode) {
			let matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
			let theme = () => {
				this.ref.current.classList.toggle("light-style", matchMedia.matches);
			}
			(matchMedia.onchange = theme), theme();
		}

		this.redirect = this.redirect.bind(this);
	}

	redirect = () => window.location.assign(this.authPath);

	componentDidMount() {
		this.target.addEventListener("click", this.redirect, { passive: true });
	}

	componentWillUnmount() {
		this.target.removeEventListener("click", this.redirect, { passive: true });
	}

	render() {
		return createElement('div', {
			ref: this.ref, class: "swivel-connect", children: [
				createElement('svg', {
					class: "icon", heigth: "58px", width: "58px", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", viewBox: "0 0 622.09431 815.20567", children: [
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m185.78512,722.53752c-2.3257-2.57814-4.55636-5.1912-6.72495-7.82005,30.41037,65.64506,52.64157,100.4882,52.64157,100.4882v-52.9691c-14.53391-10.38544-32.05025-24.32663-45.91663-39.69905Z"
							})
						}),
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m420.98693,21.67264c83.16529,150.85703,201.10737,226.82161,201.10737,226.82161,0,0-68.15333-35.82915-112.04384-80.27478-65.17563-65.99995-89.06353-146.54683-89.06353-146.54683Z"
							})
						}),
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m134.28938,615.53255c55.06509,109.34912,133.15648,164.41225,133.15648,164.41225,0,0-45.12543-25.97086-74.18606-58.18739-43.15385-47.84024-58.97042-106.22486-58.97042-106.22486Z"
							})
						}),
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m429.32177,55.4862c-54.85948,22.14835-112.63212,57.37888-143.26722,112.52183-22.08683-39.75613-58.52219-64.03704-103.8231-84.85531,0,0,30.81438,12.30852,50.19727,25.08617,30.96402,20.41204,43.47981,38.43769,43.47981,38.43769,0,0-13.19468-24.63034-36.39075-39.81986C176.65619,65.69319,73.59594,33.00034,73.59594,33.00034,42.13204,61.01435,18.75641,105.26588,14.73652,174.29877c9.15318,76.9912,26.85351,154.81205,48.44212,228.43593,33.76356,83.30965,71.23362,114.22406,71.23362,114.22406,0,0-35.84015-18.589-53.42355-56.74875,21.90311,66.83493,44.32635,128.4914,71.76205,178.87183,23.61144,43.3576,53.23955,77.43706,79.13042,104.30664v-52.66596s-53.31299-100.0828-100.68854-236.80131c-24.2424-101.91915-26.42013-211.99446-26.42013-211.99446,0,0-.95489,126.3871,7.71198,154.79321-27.58062-89.76553-49.86032-190.2166-52.89706-286.48207,0,0,149.24122,16.85213,226.46713,140.75891,49.53001-79.46987,128.62579-114.86693,179.02452-130.05813-16.61022-24.72704-28.25065-48.12456-35.7573-65.45247Z"
							})
						}),
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m554.13826,199.45559c.02577-.18233.05514-.36439.08091-.54672-1.15856-.88229-2.30741-1.81445-3.46431-2.71309,1.13279,1.09565,2.26613,2.19325,3.38339,3.25981Z"
							})
						}),
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m268.06467,87.83386S116.67847-59.02596,32.75952,27.05312C-22.26819,83.49728,8.66415,248.49425,8.66415,248.49425-2.10994,147.50711,10.05288,71.04401,49.84801,36.84784c69.51309-59.73298,218.21666,50.98601,218.21666,50.98601Z"
							})
						}),
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m582.87994,69.88295s-2.03946,22.61221-21.45809,64.14317c0,0,3.73171-75.18174,1.26219-113.55376,0,0-54.78716,6.09177-117.43649,28.90128,14.67856,23.75608,30.05097,45.35079,45.40066,64.84313,13.58096-3.02261,21.87319-3.97888,21.87319-3.97888-.30121,9.54777-.81024,19.13987-1.47639,28.7558,15.60989,18.09243,30.81854,33.88909,44.88193,47.45619,1.40905-10.82437,3.17003-27.0037,3.17003-27.0037,23.45986-51.9926,23.78296-89.56324,23.78296-89.56324Z"
							})
						}),
						createElement('g', {
							children: createElement('path', {
								class: "cls-1", d: "m552.38228,211.31964c-13.70372-10.28707-27.47726-21.75791-39.44661-33.87856-1.66122-1.68228-3.27754-3.37952-4.88556-5.07925-6.86599,62.96356-23.40117,125.61745-37.22925,186.13103-11.41582,49.9572-36.20445,108.35402-106.93224,212.67687,90.68041-107.64585,98.69126-152.16376,103.9393-181.34491-50.89058,168.2262-127.60027,300.8977-127.60027,300.8977v124.48315s31.11143-56.61464,70.13242-145.26539c9.35103-52.72997,1.32288-94.07056,1.32288-94.07056,0,0,10.99007,26.27991,14.03014,58.43518,48.09491-114.08274,103.09793-268.58333,126.66919-422.98527Z"
							})
						})
					]
				}),
				createElement('div', {
					class: "inner", children: "Sign in with Swivel"
				})
			]
		})		
	}
}

export default SwivelButton;