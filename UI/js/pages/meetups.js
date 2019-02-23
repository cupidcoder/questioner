/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const meetupsURL = `${BASE_URL}/meetups/upcoming`;

const loadMeetups = async () => {
  // Check existence of token
  if (!isLoggedIn()) {
    window.location.href = '../signin.html';
  }
  pageLoader();
  const myHeaders = new Headers({ 'x-access-token': `${localStorage.getItem('token')}` });
  try {
    const data = await makeGETRequest(meetupsURL, myHeaders);
    if (data.status === 200) {
      hidePageLoader();
      if (data.data.length === 0) {
        displaySuccessBox('No meetup available at the moment');
      } else {
        displaySuccessBox(data.message);
        hideSuccessBox();
        setTimeout(() => {
          populateMeetups(data.data);
          addMeetupEventListeners();
        }, 3500);
      }
    } else {
      hidePageLoader();
      displayErrorBox(data.error);
      hideErrorBox();
    }
  } catch (error) {
    hidePageLoader();
    displayErrorBox('Could not connect to server');
    hideErrorBox();
  }
};

window.onload = loadMeetups;
