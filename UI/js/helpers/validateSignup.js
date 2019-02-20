/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const firstPassword = document.getElementById('f_password');
const secondPassword = document.getElementById('s_password');
const signupBtn = document.getElementById('signupBtn');

const firstNameInfo = document.getElementById('firstNameInfo');
const lastNameInfo = document.getElementById('lastNameInfo');
const emailInfo = document.getElementById('emailInfo');
const passInfo = document.getElementById('passInfo');
const secondPassInfo = document.getElementById('secondPassInfo');

/**
 * Validate Sign Up form
 */
let errors = true;
const invalidNamePattern = /[^a-zA-Z]/;
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// First name validation
firstName.addEventListener('focus', () => {
  firstNameInfo.innerText = '';
  document.getElementById('signupButtonInfo').innerText = '';
});

firstName.addEventListener('blur', () => {
  if (firstName.value.length !== 0) {
    errors = false;
    if (firstName.value.length < 3) {
      firstNameInfo.innerText = 'Firstname needs to contain at least 3 characters';
      errors = true;
    } else {
      errors = false;
      if (invalidNamePattern.test(firstName.value)) {
        errors = true;
        firstNameInfo.innerText = 'Name can only contain alphabets';
      } else {
        errors = false;
      }
    }
  } else {
    firstNameInfo.innerText = 'Firstname cannot be empty';
    errors = true;
  }
});

// Second name validation
lastName.addEventListener('focus', () => {
  lastNameInfo.innerText = '';
  document.getElementById('signupButtonInfo').innerText = '';
});

lastName.addEventListener('blur', () => {
  if (lastName.value.length !== 0) {
    errors = false;
    if (lastName.value.length < 3) {
      lastNameInfo.innerText = 'lastname needs to contain at least 3 characters';
      errors = true;
    } else {
      errors = false;
      if (invalidNamePattern.test(lastName.value)) {
        errors = true;
        lastNameInfo.innerText = 'Name can only contain alphabets';
      } else {
        errors = false;
      }
    }
  } else {
    lastNameInfo.innerText = 'lastname cannot be empty';
    errors = true;
  }
});

// Email validation
email.addEventListener('focus', () => {
  emailInfo.innerText = '';
  document.getElementById('signupButtonInfo').innerText = '';
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
firstPassword.addEventListener('focus', () => {
  passInfo.innerText = '';
  document.getElementById('signupButtonInfo').innerText = '';
});

firstPassword.addEventListener('blur', () => {
  if (firstPassword.value.length !== 0) {
    errors = false;
    if (firstPassword.value.length < 6) {
      passInfo.innerText = 'Password needs to contain at least 6 characters';
      errors = true;
    } else {
      errors = false;
    }
  } else {
    passInfo.innerText = 'Password cannot be empty';
    errors = true;
  }
});

// second Password validation
secondPassword.addEventListener('focus', () => {
  secondPassInfo.innerText = '';
  document.getElementById('signupButtonInfo').innerText = '';
});

secondPassword.addEventListener('blur', () => {
  if (secondPassword.value.length !== 0) {
    errors = false;
    if (secondPassword.value.length < 6) {
      secondPassInfo.innerText = 'Password needs to contain at least 6 characters';
      errors = true;
    } else {
      errors = false;
      if (firstPassword.value !== secondPassword.value) {
        secondPassInfo.innerText = 'Passwords do not match';
        errors = true;
      } else {
        errors = false;
      }
    }
  } else {
    secondPassInfo.innerText = 'Password cannot be empty';
    errors = true;
  }
});
