/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const singupURL = `${BASE_URL}/auth/signup`;
const processSignup = async (e) => {
  e.preventDefault();
  if (!errors) {
    showButtonSpinner();
    signupBtn.disabled = true;
    const userObject = {
      firstname: firstName.value,
      lastname: lastName.value,
      email: email.value,
      password: secondPassword.value,
    };
    try {
      const data = await makeRequest(singupURL, 'POST', userObject);
      if (data.status === 201) {
        hideButtonSpinner();
        displaySuccessBox(data.message);
        hideSuccessBox();

        // Save token
        const storage = window.localStorage;
        storage.setItem('token', data.data[0].token);
        redirect('user/meetups.html');
      } else {
        hideButtonSpinner();
        displayErrorBox(data.error);
        hideErrorBox();
        signupBtn.disabled = false;
      }
    } catch (error) {
      displayErrorBox(error.message);
      hideErrorBox();
      signupBtn.disabled = false;
    }
  } else {
    document.getElementById('signupButtonInfo').innerText = 'Form is not filled properly';
  }
};

signupBtn.addEventListener('click', processSignup);
