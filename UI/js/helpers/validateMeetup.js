/* eslint-disable no-unused-vars */
const topicInput = document.getElementById('topicInput');
const locationInput = document.getElementById('locationInput');
const descriptionInput = document.getElementById('descriptionInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');

const topicInfo = document.getElementById('topicInfo');
const locationInfo = document.getElementById('locationInfo');
const descriptionInfo = document.getElementById('descriptionInfo');
const dateInfo = document.getElementById('dateInfo');
const timeInfo = document.getElementById('timeInfo');

const createMeetupBtn = document.getElementById('createBtn');

/**
 * Validate create Meetup form
 */
let errors = true;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

// Topic validation
topicInput.addEventListener('focus', () => {
  topicInfo.innerText = '';
});

topicInput.addEventListener('blur', () => {
  if (topicInput.value.length !== 0) {
    errors = false;
    if (topicInput.value.length < 6) {
      topicInfo.innerText = 'Topic needs to contain at least 6 characters';
      errors = true;
    } else {
      errors = false;
    }
  } else {
    topicInfo.innerText = 'Topic cannot be empty';
    errors = true;
  }
});

// Location validation
locationInput.addEventListener('focus', () => {
  locationInfo.innerText = '';
});

locationInput.addEventListener('blur', () => {
  if (locationInput.value.length !== 0) {
    errors = false;
    if (locationInput.value.length < 3) {
      locationInfo.innerText = 'Location needs to contain at least 3 characters';
      errors = true;
    } else {
      errors = false;
    }
  } else {
    locationInfo.innerText = 'Location cannot be empty';
    errors = true;
  }
});

// Description validation
descriptionInput.addEventListener('focus', () => {
  descriptionInfo.innerText = '';
});

descriptionInput.addEventListener('blur', () => {
  if (descriptionInput.value.length !== 0) {
    errors = false;
    if (descriptionInput.value.length < 12) {
      descriptionInfo.innerText = 'Description needs to contain at least 12 characters';
      errors = true;
    } else {
      errors = false;
    }
  } else {
    descriptionInfo.innerText = 'Description cannot be empty';
    errors = true;
  }
});

// Date validation
dateInput.addEventListener('focus', () => {
  dateInfo.innerText = '';
});

dateInput.addEventListener('blur', () => {
  if (dateInput.value.length !== 0) {
    errors = false;
    if (!dateInput.value.match(datePattern)) {
      dateInfo.innerText = 'Date needs to be in the specified format';
      errors = true;
    } else {
      errors = false;
      const date = new Date(dateInput.value);
      if (Number.isNaN(date.getTime())) {
        errors = true;
        dateInfo.innerText = 'Date is invalid';
      } else {
        errors = false;
      }
    }
  } else {
    dateInfo.innerText = 'Date cannot be empty';
    errors = true;
  }
});

// Time validation
timeInput.addEventListener('focus', () => {
  timeInfo.innerText = '';
});

timeInput.addEventListener('blur', () => {
  if (timeInput.value.length !== 0) {
    errors = false;
  } else {
    timeInfo.innerText = 'Date cannot be empty';
    errors = true;
  }
});
