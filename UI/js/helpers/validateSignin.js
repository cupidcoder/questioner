/* eslint-disable no-unused-vars */
const email = document.getElementById('email');
const password = document.getElementById('password');
const signinBtn = document.getElementById('signinBtn');

const emailInfo = document.getElementById('emailInfo');
const passwordInfo = document.getElementById('passwordInfo');

/**
 * Validate Signin form
 */

let errors = true;
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Email validation
email.addEventListener('focus', () => {
  emailInfo.innerText = '';
  document.getElementById('signinButtonInfo').innerText = '';
});

email.addEventListener('blur', () => {
  if (email.value.length !== 0) {
    errors = false;
    if (emailPattern.test(email.value)) {
      errors = false;
    } else {
      errors = true;
      emailInfo.innerText = 'Please enter valid email address';
    }
  } else {
    emailInfo.innerText = 'Email cannot be empty';
    errors = true;
  }
});

// Password validation
password.addEventListener('focus', () => {
  passwordInfo.innerText = '';
  document.getElementById('signinButtonInfo').innerText = '';
});

password.addEventListener('blur', () => {
  if (password.value.length !== 0) {
    errors = false;
    if (password.value.length < 6) {
      passwordInfo.innerText = 'Password needs to contain at least 6 characters';
      errors = true;
    } else {
      errors = false;
    }
  } else {
    passwordInfo.innerText = 'Password cannot be empty';
    errors = true;
  }
});
