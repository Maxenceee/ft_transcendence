import { createElement, pushState } from '..';

/**
 * 
 * @param {{
* 	to: string,
* }} props 
* @returns 
*/
function link(props) {
   const { to } = props;

   if (to === undefined) throw new Error('Link must have a destination (missing `to` property)');

   const handleClick = (event) => {
	   if (event.metaKey || event.ctrlKey) {
		   return;
	   }
	   event.preventDefault();
	   pushState(to);
   };

   return createElement('a', { href: to, onClick: handleClick, ...props });
}

export default link;