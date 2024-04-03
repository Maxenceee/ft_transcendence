var Me = function(a, b, c) {
	return Le(document, arguments)
},
Le = function(a, b) {
	var c = String(b[0]),
		d = b[1],
		e = b[2] || null;
	c = (["svg", "path", "circle", "text"].includes(c.toLowerCase()) ? a.createElementNS("http://www.w3.org/2000/svg", c) : a.createElement(c));
	if (e && e.in) c.innerHTML = e.in;
	if (e && e.style) c.style = e.style;

	b && (d && typeof e !== "object" && !je(d) ? Na(c, d, e) : (e && e.type ? c.setAttribute(e.type, d) : d && (c.className = d)));
	return c
},
Na = function(b, c, d) {
	function e(h, i) {
		b.setAttribute(h, i);
	}
	for (var i = 0; i < Math.min(c.length, d.length); i++) {
		e(c[i], d[i]);
	}
},
Mc = function(a, b) {
	a.classList.add(b);
},
Mr = function(a, b) {
	a.classList.remove(b);
},
jl = function(a) {
	return ("string" == typeof a);
},
Ms = function(a, b, c) {
	jl(b) ? a.setAttribute(b, c !== undefined ? c : "") : Na(a, b, c)
	return (a);
},
Md = function(a, b) {
	(b instanceof Node) ? a.appendChild(b) : dj(a, b)
	return (a);
},
Mg = function(a, b) {
	return (a.getElementsByClassName(b));
},
Mqa = function(a, b) {
	return (a.querySelectorAll(b));
},
Mq = function(a, b) {
	return (a.querySelector(b));
},
dj = function(a, b) {
	for(var i = 0; i < b.length; i++) 
		(a && b[i]) && a.appendChild(b[i]);
}

/**
 * 
 * @param {{
 *  message: string;
 *  delay?: number;
 *  color?: "default"|"warn"|"error"
 * }} data
 */
export default function AlertBanner({ message, delay = 5000, color = "default" }) {
    if (!message)
        throw new Error("Message is required");
    let u,
		sg,
		pt,
		pth,
		tts;

    sg = Ms(Me("svg"), ["width", "height", "fill", "xmlns"], ["28", "28", "none", "http://www.w3.org/2000/svg"]);
    pt = Ms(Me("path"), "d", "M5.32789 25.4892H23.4434C25.4884 25.4892 26.7692 24.0199 26.7692 22.1784C26.7692 21.6108 26.6073 21.0197 26.3037 20.4851L17.2332 4.67086C16.5964 3.55805 15.5091 3 14.3867 3C13.2622 3 12.159 3.56227 11.536 4.67086L2.46547 20.4872C2.14484 21.0293 2 21.6108 2 22.1784C2 24.0199 3.28086 25.4892 5.32789 25.4892ZM5.52733 23.2823C4.78928 23.2823 4.3435 22.7107 4.3435 22.0634C4.3435 21.866 4.38404 21.6101 4.49819 21.3893L13.3693 5.88631C13.588 5.49701 13.9953 5.33061 14.3867 5.33061C14.776 5.33061 15.1695 5.49912 15.3903 5.88842L24.2635 21.4052C24.3777 21.6239 24.4278 21.8681 24.4278 22.0634C24.4278 22.7107 23.9628 23.2823 23.2344 23.2823H5.52733Z");
    pth = Ms(Me("path"), "d", "M14.3888 17.3883C15.023 17.3883 15.3934 17.0243 15.4135 16.3474L15.586 10.6567C15.6083 9.97682 15.0889 9.48511 14.3771 9.48511C13.6557 9.48511 13.1555 9.96721 13.1778 10.6471L13.3407 16.3516C13.3609 17.0147 13.7333 17.3883 14.3888 17.3883ZM14.3888 21.2707C15.1402 21.2707 15.7599 20.7232 15.7599 19.9845C15.7599 19.2382 15.1498 18.6982 14.3888 18.6982C13.6278 18.6982 13.0156 19.2457 13.0156 19.9845C13.0156 20.7136 13.6374 21.2707 14.3888 21.2707Z");
    tts = Me("div", "progression", {style: "width: 100%;"})
    u = Md(Me("div", "ws-server-p" + (color == "error" && " error" || color == "warn" && " warn" || "")),[Md(Me("div"), Md(sg, [pt, pth])), Me("p", "", {in: message}), tts]);

    let tm = delay/100,
        k = 0,
        x = window.setInterval(() => {
            k++;
            if (k >= 100) clearInterval(x), u.remove();
            tts.style.width = 100 - k + "%";
        }, tm);
    Md(document.body, u);
}