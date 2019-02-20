/* eslint-disable no-unused-vars */
/**
 * Inserts spinners from the DOM
 */

const showButtonSpinner = () => {
  setTimeout(() => {
    document.getElementById('buttonContainer').insertAdjacentHTML('beforeend', '<img src="../img/small-spinner.gif" alt="Small spinner" id="small-spinner">');
  }, 500);
};

/**
 * Remove spinners from the DOM
 */
const hideButtonSpinner = () => {
  setTimeout(() => {
    document.getElementById('small-spinner').parentNode.removeChild(document.getElementById('small-spinner'));
  }, 1500);
};

/**
 * Display success alert box
 * @param {string} message
 */
const displaySuccessBox = (message) => {
  const { body } = window.document;
  setTimeout(() => {
    body.insertAdjacentHTML('afterbegin', `<div id="successBox" class="alertBox">${message}</div>`);
  }, 1500);
};

/**
 * Hide success alert box
 */
const hideSuccessBox = () => {
  setTimeout(() => {
    document.getElementById('successBox').parentNode.removeChild(document.getElementById('successBox'));
  }, 4500);
};

/**
 * Display Error alert box
 * @param {string} message
 */
const displayErrorBox = (message) => {
  const { body } = window.document;
  setTimeout(() => {
    body.insertAdjacentHTML('afterbegin', `<div id="errorBox" class="alertBox">${message}</div>`);
  }, 1500);
};

/**
 * Hide success alert box
 */
const hideErrorBox = () => {
  setTimeout(() => {
    document.getElementById('errorBox').parentNode.removeChild(document.getElementById('errorBox'));
  }, 4500);
};

/**
 * Redirect to another page
 */
const redirect = (location) => {
  setTimeout(() => {
    window.location.href = location;
  }, 5500);
};
