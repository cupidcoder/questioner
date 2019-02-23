/* eslint-disable no-unused-vars */
/**
 * Makes HTTP POST calls to Backend APIs
 * @param {string} url
 * @param {string} method
 * @param {string} data
 * @returns {object} response
 */

const makeRequest = (url, method, data = {}) => new Promise((resolve, reject) => {
  fetch(url, {
    method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => resolve(response.json()))
    .catch(error => reject(error));
});

/**
 * Makes HTTP GET calls to Backend APIs
 * @param {string} url
 * @returns {object} response
 */

const makeGETRequest = (url, headers) => new Promise((resolve, reject) => {
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers,
  })
    .then(response => resolve(response.json()))
    .catch(error => reject(error));
});
