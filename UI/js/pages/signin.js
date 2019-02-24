/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const singinURL = `${BASE_URL}/auth/login`;
const processSignin = async (e) => {
  e.preventDefault();
  if (!errors) {
    showButtonSpinner();
    signinBtn.disabled = true;
    const userCredentials = {
      email: email.value,
      password: password.value,
    };
    const myHeaders = new Headers({ 'Content-type': 'Application/json' });
    try {
      const data = await makeRequest(singinURL, 'POST', myHeaders, userCredentials);
      if (data.status === 200) {
        hideButtonSpinner();
        displaySuccessBox(data.message);
        hideSuccessBox();

        const location = data.data[0].user.isAdmin ? 'admin/meetups.html' : 'user/meetups.html';

        // Save token
        const storage = window.localStorage;
        storage.setItem('token', data.data[0].token);
        redirect(location);
      } else {
        hideButtonSpinner();
        displayErrorBox(data.error);
        hideErrorBox();
        signinBtn.disabled = false;
      }
    } catch (error) {
      hideButtonSpinner();
      displayErrorBox('Could not connect to server');
      hideErrorBox();
      signinBtn.disabled = false;
    }
  } else {
    document.getElementById('signinButtonInfo').innerText = 'Form is not filled properly';
  }
};

signinBtn.addEventListener('click', processSignin);
