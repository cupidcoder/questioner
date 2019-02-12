# Questioner &middot; [![Build Status](https://travis-ci.org/cupidcoder/questioner.svg?branch=develop)](https://travis-ci.org/cupidcoder/questioner) [![Coverage Status](https://coveralls.io/repos/github/cupidcoder/questioner/badge.svg?branch=develop)](https://coveralls.io/github/cupidcoder/questioner?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/d4c093b47b636c5942fc/maintainability)](https://codeclimate.com/github/cupidcoder/questioner/maintainability) [![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)


> Questioner helps meetup organisers crowd-source questions to be asked concerning the meetup and help them prioritize questions that should be answered based on votes by other attendees.


---
## Implemented Features
- Users can register on the application
- Users can log into the application
- Users can create a meetup entry
- Users can fetch all meetup entries created in the system
- Users can fetch a specific meetup entry
- Users can fetch all upcoming meetup entries
- Users can respond to attend a meetup
- Users can post question to a meetup
- Users can upvote a question
- Users can downvote a question
- Users can comment on a question
- Admin Users can delete meetup
---

## Templates
UI template for the application is hosted on [Github pages](https://cupidcoder.github.io/questioner)

---

## Technologies Used
- [Node.js](https://nodejs.org/) - A runtime environment based off of Chromes's V8 Engine for writing Javascript server-side applications.
- [Express.js](https://expressjs.com/) - Web application framework based on Node.js.
- [ESLint](https://eslint.org/) - A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
- [Airbnb](https://www.npmjs.com/package/eslint-config-airbnb) style guide was followed.
- [PostgreSQL](https://www.postgresql.org/) - Relational Database System used in project.
- [JWT](https://www.npmjs.com/package/jsonwebtoken) used to authorize and authenticate API routes.

---

## Testing Tools
- [Mocha](#https://mochajs.org/) - A JavaScript test framework.
- [Chai](https://chaijs.com) - A test assertion library for JavaScript.

---

## API Information

The API endpoints are hosted on [Heroku](#https://heroku.com) - https://questioner40.herokuapp.com/api/v1/

METHOD | DESCRIPTION | ENDPOINTS
-------|-------------|-----------
POST   | User registration | `/api/v1/auth/signup`
POST   | User log in | `/api/v1/auth/signin`
POST   | Create a meetup record | `/api/v1/meetups`
GET    | Get all meetup records | `/api/v1/meetups`
GET    | Get specific meetup record | `/api/v1/meetups/:meetupID`
GET    | Get all upcoming meetup records | `/api/v1/meetups/upcoming`
DELETE    | Delete meetup record | `/api/v1/meetups/:meetupID`
POST   | Respond to a meetup    | `/api/v1/meetups/:meetupID/rsvp`
POST   | Post a question to a meetup     | `/api/v1/questions`
POST   | Post a comment to a question     | `/api/v1/comments`
PATCH  | Upvote a question | `/api/v1/questions/:questionID/upvote`
PATCH  | Downvote a question | `/api/v1/questions/:questionID/downvote`


---
## Installation

- You need to have `node` and `npm` installed on your computer
- You may click [Node.js](https://nodejs.org) to get `node` and `npm`

#### Clone

- Clone this repo to your local machine using `git clone https://github.com/cupidcoder/questioner.git`

#### Setup

- Installing the project's dependencies:

> run the command below

```shell
$ npm install
```

> To start the server, run the command below

```shell
$ npm start
```

> Navigate to `http://localhost:7000/api/v1` to use the application


---

## Test

> run test using the command below

```shell
$ npm test
```

---

## Author

* Chukwudi Dennis Umeilechukwu