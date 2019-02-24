/**
 * Main JS for application
 */

/* Application Constants */

const headerNavBurger = document.getElementById('headerNavBurger');
const burgerMenuNav = document.getElementById('burgerMenuNav');

/* Application Functions */

/*
* Show or hide the drop-down burger menu
*
* @return null
*/
const showBurgerNav = () => {
  const style = (burgerMenuNav.style.display === 'none') ? 'block' : 'none';
  burgerMenuNav.style.display = style;
};

/*
*   Burger Menu Drop down
*/

headerNavBurger.addEventListener('click', showBurgerNav);
