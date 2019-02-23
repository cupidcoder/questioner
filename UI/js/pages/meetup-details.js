/* eslint-disable no-undef */
const processMeetupDetails = async () => {
  // Check existence of token
  if (!isLoggedIn()) {
    window.location.href = '../signin.html';
  }
  // Ensure there's currently a meetup record in memory
  if (localStorage.getItem('meetup-details') === null) {
    window.location.href = 'meetups.html';
  }
  const meetupDetails = JSON.parse(localStorage.getItem('meetup-details'));
  populateMeetupDetails(meetupDetails);
};

window.onload = processMeetupDetails;
