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

  // Get questions
  pageLoader();
  const getQuestionsURL = `${BASE_URL}/meetups/${meetupDetails.id}/questions`;
  const myHeaders = new Headers({ 'x-access-token': `${localStorage.getItem('token')}` });
  try {
    const response = await makeGETRequest(getQuestionsURL, myHeaders);
    if (response.status === 200) {
      if (response.data.length > 0) {
        populateQuestions(response.data);
        hidePageLoader();
        addQuestionEventListeners();
      } else {
        hidePageLoader();
      }
      addMeetupDetailsEventListeners();
    } else {
      hidePageLoader();
      displayErrorBox(response.error);
      hideErrorBox();
    }
  } catch (error) {
    hidePageLoader();
    displayErrorBox('Could not connect to server');
    hideErrorBox();
  }
};

window.onload = processMeetupDetails;
