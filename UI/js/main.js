/*==== Main JS for application ===*/

/* Application Constants */

const headerNavBurger = document.getElementById("headerNavBurger");
const burgerMenuNav = document.getElementById("burgerMenuNav");


/*
*   Burger Menu Drop down
*/

headerNavBurger.addEventListener('click', showBurgerNav);


function showBurgerNav() {
    let style = ( burgerMenuNav.style.display === 'none' ) ? 'block' : 'none';
    burgerMenuNav.style.display = style;
}