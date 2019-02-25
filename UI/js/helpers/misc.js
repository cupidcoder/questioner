/* eslint-disable no-undef */
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
  }, 50);
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
 * check if admin page is being viewed
 * @returns {boolean} true/false
 */
const isAdmin = () => ((window.location.href.search('user') > 0) ? false : true);

/**
 * Populate Meetups page
 * @param {Array} meetups
 */
const populateMeetups = (meetups) => {
  const meetupsListingDiv = document.getElementById('meetupsListing');
  const rowStart = '<div class="row">';
  const rowEnd = '</div>';
  const meetupString = (!isAdmin()) ? '<div class="col-1-of-4"><!-- Div to hold a meetup --><div class="meetupBox"><div class="meetupImage"><img src="%image%" alt="meetup logo" class="viewMeetup" id="%meetupID%"></div><div class="meetupBoxInfo meetupBoxAdmin"><p>%topic%</p><p class="meetupDesc">%description%</p></div></div><!--  End of Div to hold a meetup --></div>' : '<div class="col-1-of-4"><!-- Div to hold a meetup --><div class="meetupBox"><div class="meetupImage"><img src="%image%" alt="meetup logo" class="viewMeetup" id="%meetupID%"></div><div class="meetupBoxInfo meetupBoxAdmin"><p>%topic%</p><div class="editLogo adminMeetupEdit"><i class="far fa-edit editMeetup" id="%editID%"></i></div><div class="deleteLogo adminMeetupDelete"><i class="fas fa-trash deleteMeetup" id="%deleteID%"></i></div></div></div><!--  End of Div to hold a meetup --></div>';

  let meetupRow = '';

  for (let i = 0; i < meetups.length; i += 1) {
    const imageURL = meetups[i].images === null ? '../../img/uploads/default-meetup.jpg' : meetups[i].images[0];
    let meetup = meetupString.replace('%image%', imageURL);
    meetup = meetup.replace('%topic%', meetups[i].topic);
    meetup = meetup.replace('%meetupID%', `meetup-id-${meetups[i].id}`);
    if (!isAdmin()) {
      meetup = meetup.replace('%description%', meetups[i].description);
    }

    if (isAdmin()) {
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
const viewMeetup = async (e) => {
  const meetup = e.target.id.split('-');
  const meetupID = meetup[2];
  const url = `${BASE_URL}/meetups/${meetupID}`;
  const myHeaders = new Headers({ 'x-access-token': `${localStorage.getItem('token')}` });
  try {
    const response = await makeGETRequest(url, myHeaders);
    if (response.status === 200) {
      localStorage.setItem('meetup-details', JSON.stringify(response.data[0]));
      displaySuccessBox('Redirecting...');
      setTimeout(() => {
        redirect('meetup-details.html');
      }, 2000);
    } else {
      displayErrorBox(response.error);
      hideErrorBox();
    }
  } catch (error) {
    displayErrorBox('Could not connect to server');
    hideErrorBox();
  }
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
  const viewMeetups = document.querySelectorAll('.viewMeetup');
  Array.prototype.forEach.call(viewMeetups, (el) => {
    el.addEventListener('click', viewMeetup);
  });

  if (isAdmin()) {
    const editMeetups = document.querySelectorAll('.editMeetup');
    Array.prototype.forEach.call(editMeetups, (el) => {
      el.addEventListener('click', editMeetup);
    });

    const deleteMeetups = document.querySelectorAll('.deleteMeetup');
    Array.prototype.forEach.call(deleteMeetups, (el) => {
      el.addEventListener('click', deleteMeetup);
    });
  }
};

/**
 * Populate Details of meetup
 * @param {object} meetupDetails
 */
const populateMeetupDetails = (meetupDetails) => {
  const imageURL = (meetupDetails.images === null) ? '../../img/uploads/default-meetup.jpg' : meetupDetails.images[0];
  let meetupImageHTML = '<img src="%image%" alt="Meetup logo">';
  meetupImageHTML = meetupImageHTML.replace('%image%', imageURL);
  let meetupTimeLocationHTML = '<i class="fas fa-calendar-day"></i> %date%<span> <i class="fas fa-map-marker-alt"></i> %location%</span>';
  meetupTimeLocationHTML = meetupTimeLocationHTML.replace('%date%', moment(meetupDetails.happening_on).format('MMMM Do, YYYY'));
  meetupTimeLocationHTML = meetupTimeLocationHTML.replace('%location%', meetupDetails.location);

  document.getElementById('meetupTimeLocation').innerHTML = meetupTimeLocationHTML;
  document.getElementById('meetupTopic').innerText = meetupDetails.topic;
  document.getElementById('meetUpDetailsImage').innerHTML = meetupImageHTML;
  document.getElementById('meetupDescTitle').innerText = meetupDetails.description;
};

/**
 * Populate questions
 * @param {Array} questions
 */
const populateQuestions = (questions) => {
  const questionHTML = '<div class="meetUpDetailsQuestion meetUpDetailsInfoDesc" id="%questionID%"><p>%body%</p><i class="far fa-thumbs-up upvoteQuestion"></i><i class="fas fa-thumbs-down downvoteQuestion"></i><i class="far fa-comments meetupDetailsCommentBtn"></i></div>';

  for (let i = 0; i < questions.length; i += 1) {
    let meetup = questionHTML.replace('%body%', questions[i].body);
    meetup = meetup.replace('%questionID%', `question-id-${questions[i].id}`);
    document.getElementById('meetupQuestions').insertAdjacentHTML('afterbegin', meetup);
  }
};

/**
 * upvote question
 */
const upvoteQuestion = async (e) => {
  pageLoader();
  const questionID = e.target.parentNode.id.split('-')[2];
  const upvoteQuestionURL = `${BASE_URL}/questions/${questionID}/upvote`;
  const myHeaders = new Headers({ 'x-access-token': `${localStorage.getItem('token')}` });

  try {
    const response = await makeRequest(upvoteQuestionURL, 'PATCH', myHeaders);
    if (response.status === 200) {
      hidePageLoader();
      displaySuccessBox(response.message);
      hideSuccessBox();
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

/**
 * downvote question
 */
const downvoteQuestion = async (e) => {
  pageLoader();
  const questionID = e.target.parentNode.id.split('-')[2];
  const downvoteQuestionURL = `${BASE_URL}/questions/${questionID}/downvote`;
  const myHeaders = new Headers({ 'x-access-token': `${localStorage.getItem('token')}` });

  try {
    const response = await makeRequest(downvoteQuestionURL, 'PATCH', myHeaders);
    if (response.status === 200) {
      hidePageLoader();
      displaySuccessBox(response.message);
      hideSuccessBox();
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

/**
 * Populate comments dialog box
 * @param {Array} comments
 */
const populateComments = (comments) => {
  const commentHTML = '<div class="commentBox" id="%commentID%"><div class="commentAuthor"><p>by&nbsp;&nbsp;<span>John Doe</span></p></div><p>%comment%</p></div>';

  for (let i = 0; i < comments.length; i += 1) {
    let comment = commentHTML.replace('%comment%', comments[i].comment);
    comment = comment.replace('%commentID%', `comment-id-${comments[i].id}`);
    document.getElementById('questionComments').insertAdjacentHTML('afterbegin', comment);
  }
};

/**
 * comment question
 */
const commentQuestion = async (e) => {
  pageLoader();
  const questionID = e.target.parentNode.id.split('-')[2];
  // Save questionID in localStorage for use in comment dialog box
  localStorage.setItem('questionID', questionID);
  const questionCommentsURL = `${BASE_URL}/questions/${questionID}/comments`;
  const myHeaders = new Headers({ 'x-access-token': `${localStorage.getItem('token')}` });
  try {
    const response = await makeGETRequest(questionCommentsURL, myHeaders);
    if (response.status === 200) {
      hidePageLoader();
      if (response.data.length > 0) {
        setTimeout(() => {
          populateComments(response.data);
          document.getElementById('meetupCommentBackground').style.display = 'block';
        }, 3000);
      } else {
        setTimeout(() => {
          document.getElementById('meetupCommentBackground').style.display = 'block';
        }, 3000);
      }
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

/**
 * Post comment to question
 */
const postComment = () => {

};

/**
 * Add eventListeners for upvote, downvote and comment functions
 */
const addQuestionEventListeners = () => {
  const upvoteIcons = document.querySelectorAll('.upvoteQuestion');
  const downvoteIcons = document.querySelectorAll('.downvoteQuestion');
  const commentIcons = document.querySelectorAll('.meetupDetailsCommentBtn');
  const closeCommentDialogBox = document.querySelector('.close');
  const postCommentBtn = document.getElementById('postCommentBtn');

  Array.prototype.forEach.call(upvoteIcons, (el) => {
    el.addEventListener('click', upvoteQuestion);
  });

  Array.prototype.forEach.call(downvoteIcons, (el) => {
    el.addEventListener('click', downvoteQuestion);
  });

  Array.prototype.forEach.call(commentIcons, (el) => {
    el.addEventListener('click', commentQuestion);
  });

  closeCommentDialogBox.addEventListener('click', () => {
    document.getElementById('meetupCommentBackground').style.display = 'none';
    const questionComments = document.getElementById('questionComments');
    while (questionComments.firstChild) {
      questionComments.removeChild(questionComments.firstChild);
    }
  });

  postCommentBtn.addEventListener('click', postComment);
};

/**
 * post question to meetup
 */
const postQuestion = async (e) => {
  e.preventDefault();
  pageLoader();
  const postQuestionURL = `${BASE_URL}/questions`;
  const meetupID = JSON.parse(localStorage.getItem('meetup-details')).id;
  const questionBody = document.getElementById('questionBody');
  const questionObject = {
    meetupID,
    body: questionBody.value,
  };

  const myHeaders = new Headers({
    'Content-type': 'Application/json',
    'x-access-token': `${localStorage.getItem('token')}`,
  });

  try {
    const response = await makeRequest(postQuestionURL, 'POST', myHeaders, questionObject);
    if (response.status === 201) {
      hidePageLoader();
      displaySuccessBox(response.message);
      hideSuccessBox();
      setTimeout(() => {
        populateQuestions(response.data);
        questionBody.value = '';
        addQuestionEventListeners();
      }, 3000);
    } else if (response.status === 400) {
      hidePageLoader();
      displayErrorBox('Question cannot be empty');
      hideErrorBox();
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

/**
 * respond to meetup
 */
const respondToMeetup = async (e) => {
  pageLoader();
  const meetupID = JSON.parse(localStorage.getItem('meetup-details')).id;
  const rsvpURL = `${BASE_URL}/meetups/${meetupID}/rsvp`;
  const action = {
    response: e.target.parentNode.id.split('-')[0],
  };

  const myHeaders = new Headers({
    'Content-type': 'Application/json',
    'x-access-token': `${localStorage.getItem('token')}`,
  });

  try {
    const response = await makeRequest(rsvpURL, 'POST', myHeaders, action);
    if (response.status === 201) {
      hidePageLoader();
      displaySuccessBox(response.message);
      hideSuccessBox();
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

/**
 * Add eventListeners for rsvp and post question
 */
const addMeetupDetailsEventListeners = () => {
  const postQuestionBtn = document.getElementById('postQuestion');
  const maybeRSVP = document.getElementById('maybeResponse');
  const noRSVP = document.getElementById('noResponse');
  const yesRSVP = document.getElementById('yesResponse');

  postQuestionBtn.addEventListener('click', postQuestion);
  maybeRSVP.addEventListener('click', respondToMeetup);
  noRSVP.addEventListener('click', respondToMeetup);
  yesRSVP.addEventListener('click', respondToMeetup);
};
