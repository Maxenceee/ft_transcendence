import { pushState } from '../routers/routing.js';

/**
 * 
 * @param {string} path 
 */
function navigate(path) {
	if (typeof path !== "string") throw new Error('Path must be a string, not '+typeof path);
	pushState(path);
}

export default navigate;