/* eslint-disable no-undef */
// Check existence of token
if (!isLoggedIn()) {
  window.location.href = '../signin.html';
}

topicInput.focus(); // Activate input validation

/**
 * Process Creation of Meetup
 */
const createMeetup = async (e) => {
  e.preventDefault();
  if (!errors) {
    showButtonSpinnerMeetup();
    createMeetupBtn.disabled = true;
    const meetupURL = `${BASE_URL}/meetups`;
    const newMeetupObject = {
      topic: topicInput.value,
      description: descriptionInput.value,
      location: locationInput.value,
      happeningOn: `${dateInput.value} ${timeInput.value}`,
    };
    const myHeaders = new Headers({
      'Content-type': 'Application/json',
      'x-access-token': `${localStorage.getItem('token')}`,
    });

    try {
      const response = await makeRequest(meetupURL, 'POST', myHeaders, newMeetupObject);
      if (response.status === 201) {
        hideButtonSpinner();
        displaySuccessBox(response.message);
        hideSuccessBox();
        redirect('meetups.html');
      } else {
        hideButtonSpinner();
        displayErrorBox(response.error);
        hideErrorBox();
        createMeetupBtn.disabled = false;
      }
    } catch (error) {
      hideButtonSpinner();
      displayErrorBox('Could not connect to server');
      hideErrorBox();
      createMeetupBtn.disabled = false;
    }
  }
};

createMeetupBtn.addEventListener('click', createMeetup);
