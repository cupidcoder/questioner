/* eslint-disable no-unneeded-ternary */
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

/**
 * Check if user is logged in
 * @returns {boolean} true/false
 */
const isLoggedIn = () => {
  if (window.localStorage.getItem('token') === null) return false;
  return true;
};

/**
 * Page loader
 */
const pageLoader = () => {
  window.setTimeout(() => {
    document.getElementById('page-loader-container').style.display = 'block';
  }, 1000);
};

/**
 * Hide Page loader
 */
const hidePageLoader = () => {
  window.setTimeout(() => {
    document.getElementById('page-loader-container').style.display = 'none';
  }, 3000);
};

/**
 * Populate Meetups page
 * @param {Array} meetups
 */
const populateMeetups = (meetups) => {
  const meetupsListingDiv = document.getElementById('meetupsListing');
  const rowStart = '<div class="row">';
  const rowEnd = '</div>';
  const isAdmin = (window.location.href.search('user') > 0) ? false : true;
  const meetupString = (!isAdmin) ? '<div class="col-1-of-4"><!-- Div to hold a meetup --><div class="meetupBox"><div class="meetupImage"><img src="%image%" alt="meetup logo" class="viewMeetup" id="%meetupID%"></div><div class="meetupBoxInfo meetupBoxAdmin"><p>%topic%</p><p class="meetupDesc">%description%</p></div></div><!--  End of Div to hold a meetup --></div>' : '<div class="col-1-of-4"><!-- Div to hold a meetup --><div class="meetupBox"><div class="meetupImage"><img src="%image%" alt="meetup logo" class="viewMeetup" id="%meetupID%"></div><div class="meetupBoxInfo meetupBoxAdmin"><p>%topic%</p><div class="editLogo adminMeetupEdit"><i class="far fa-edit editMeetup" id="%editID%"></i></div><div class="deleteLogo adminMeetupDelete"><i class="fas fa-trash deleteMeetup" id="%deleteID%"></i></div></div></div><!--  End of Div to hold a meetup --></div>';

  let meetupRow = '';

  for (let i = 0; i < meetups.length; i += 1) {
    const imageURL = meetups[i].images === null ? '../../img/uploads/default-meetup.jpg' : meetups[i].images[0];
    let meetup = meetupString.replace('%image%', imageURL);
    meetup = meetup.replace('%topic%', meetups[i].topic);
    meetup = meetup.replace('%meetupID%', `meetup-id-${meetups[i].id}`);
    if (!isAdmin) {
      meetup = meetup.replace('%description%', meetups[i].description);
    }

    if (isAdmin) {
      meetup = meetup.replace('%editID%', `edit-id-${meetups[i].id}`);
      meetup = meetup.replace('%deleteID%', `delete-id-${meetups[i].id}`);
    }

    meetupRow += meetup;
    // rows of 4 items each
    if (((i + 1) % 4) === 0) {
      meetupsListingDiv.insertAdjacentHTML('beforeend', `${rowStart}${meetupRow}${rowEnd}`);
      meetupRow = '';
    } else if (i === meetups.length - 1) {
      meetupsListingDiv.insertAdjacentHTML('beforeend', `${rowStart}${meetupRow}${rowEnd}`);
    }
  }
};

/**
 * View meetup details function
 * @param {object} global event object
 */
const viewMeetup = (e) => {

};

/**
 * Edit meetup function
 * @param {object} global event object
 */
const editMeetup = (e) => {

};

/**
 * delete meetup function
 * @param {object} global event object
 */
const deleteMeetup = (e) => {

};

/**
 * Add necessary meetup EventListeners
 */

const addMeetupEventListeners = () => {
  const isAdmin = (window.location.href.search('user') > 0) ? false : true;
  const viewMeetups = document.querySelectorAll('.viewMeetup');
  Array.prototype.forEach.call(viewMeetups, (el) => {
    el.addEventListener('click', e => viewMeetup);
  });

  if (isAdmin) {
    const editMeetups = document.querySelectorAll('.editMeetup');
    Array.prototype.forEach.call(editMeetups, (el) => {
      el.addEventListener('click', e => editMeetup);
    });

    const deleteMeetups = document.querySelectorAll('.deleteMeetup');
    Array.prototype.forEach.call(deleteMeetups, (el) => {
      el.addEventListener('click', e => deleteMeetup);
    });
  }
};
