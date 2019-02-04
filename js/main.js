/*==== Main JS for application ===*/

/* Application Constants */

const headerNavBurger = document.getElementById("headerNavBurger");
const burgerMenuNav = document.getElementById("burgerMenuNav");

const meetupDetailsCommentBtn = document.getElementsByClassName("meetupDetailsCommentBtn");
const meetupCommentBackground = document.getElementById("meetupCommentBackground");


/*
*   Burger Menu Drop down
*/

headerNavBurger.addEventListener('click', showBurgerNav);



/*
*   Comments dialog Box
*/

Array.prototype.forEach.call(meetupDetailsCommentBtn, (el) => {
    el.addEventListener('click', showCommentDialog);
});





/* Application Functions */

/*
* Show or hide the drop-down burger menu
*
* @return null
*/
function showBurgerNav() {
    let style = ( burgerMenuNav.style.display === 'none' ) ? 'block' : 'none';
    burgerMenuNav.style.display = style;
}

/*
* Show comments dialog Box in meetup details page
*
* @return null
*/

function showCommentDialog() {
    let style = ( meetupCommentBackground.style.display === 'none' ) ? 'block' : 'none';
    meetupCommentBackground.style.display = style;
}

/*
* Where window.onclick events are handled
*
* @return null
*/
window.onclick = function(e) {
    // For closing comments dialog
    if (e.target == meetupCommentBackground) meetupCommentBackground.style.display = 'none';
}