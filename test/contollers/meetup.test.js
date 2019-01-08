import chai, { assert } from 'chai';
import app from '../../app';
import statusCodes from '../../server/helpers/status';

chai.use(require('chai-http'));

const should = chai.should();

describe('POST /api/v1/meetups', () => {
  // Sample valid meetup request data
  const meetupRecord = {
    location: 'Ikeja',
    topic: 'nodejs ninja',
    description: 'A group passionate about writing exceptional nodejs applications',
    happeningOn: new Date().getTime(),
  };

  // sample invalid meetup request data
  const invalidMeetupRecord = {
    location: '',
    topic: '',
    description: '',
    happeningOn: new Date().getTime(),
  };

  describe('response', () => {
    it('should respond with newly created meetup record if request is valid', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .send(meetupRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.created);
          res.body.should.have.property('data');
          res.body.data[0].should.have.property('id');
          res.body.data[0].should.have.property('createdOn');
          res.body.data[0].should.have.property('location');
          res.body.data[0].should.have.property('images');
          res.body.data[0].should.have.property('topic');
          res.body.data[0].should.have.property('description');
          res.body.data[0].should.have.property('happeningOn');
          res.body.data[0].should.have.property('tags');
          done();
        });
    });

    it('should respond with error if request is invalid', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .send(invalidMeetupRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          res.body.should.have.property('error');
          res.body.error.should.eql('Required fields are empty');
          done();
        });
    });
  });
});


describe('GET /api/v1/meetups', () => {
  // Sample valid meetup request data
  const meetupRecord = {
    location: 'Radison Blue',
    topic: 'Chess nation',
    description: 'We hold mini chess tournaments with amazing rewards.',
    happeningOn: new Date().getTime(),
  };
  // Make POST request
  it('should create a meetup record', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send(meetupRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.created);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('createdOn');
        res.body.data[0].should.have.property('location');
        res.body.data[0].should.have.property('images');
        res.body.data[0].should.have.property('topic');
        res.body.data[0].should.have.property('description');
        res.body.data[0].should.have.property('happeningOn');
        res.body.data[0].should.have.property('tags');
        done();
      });
  });

  it('should return data array with at least one element if meetups exist', (done) => {
    chai.request(app)
      .get('/api/v1/meetups')
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data.length.should.be.above(1);
        done();
      });
  });
});

describe('GET /api/v1/meetups/:id', () => {
  // Sample valid meetup request data
  const meetupRecord = {
    location: 'Ogba',
    topic: 'Book club',
    description: 'We believe through the lens of a good library, life is amazing',
    happeningOn: new Date().getTime(),
  };

  // meetupRecord response
  let meetupRecordResponse;

  // Make POST request to save meetup
  before((done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send(meetupRecord)
      .end((err, res) => {
        [meetupRecordResponse] = res.body.data;
        done();
      });
  });
  it('should return meetup with same id if meetup record exists', (done) => {
    // Make GET request to get saved meetup
    chai.request(app)
      .get(`/api/v1/meetups/${meetupRecordResponse.id}`)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('id').eql(meetupRecordResponse.id);
        done();
      });
  });

  it('should return 404 if meetup record does not exist', (done) => {
    // Non-existing id
    const id = '10ba038e-48da-487b-96e8-8d3b99b6d18a';
    chai.request(app)
      .get(`/api/v1/meetups/${id}`)
      .end((err, res) => {
        res.should.have.status(statusCodes.notFound);
        res.body.should.have.property('error');
        res.body.error.should.be.eql('Meetup not found');
        done();
      });
  });
});

describe('GET /api/v1/meetups/upcoming', () => {
  let upcomingMeetups;
  before((done) => {
    chai.request(app)
      .get('/api/v1/meetups/upcoming')
      .end((err, res) => {
        upcomingMeetups = res.body.data;
        done();
      });
  });
  it('should return all meetups in ascending order by happeningOn property timestamp', () => {
    const [upcomingMeetupOne, upcomingMeetupTwo] = upcomingMeetups;
    assert.isAbove(upcomingMeetupTwo.happeningOn, upcomingMeetupOne.happeningOn);
  });
});

describe('POST /api/v1/meetups/:id/rsvp', () => {
  describe('request', () => {
    let meetupRecordResponse;
    // Sample valid meetup request data
    const meetupRecord = {
      location: 'Radison Blue',
      topic: 'Chess nation',
      description: 'We hold mini chess tournaments with amazing rewards.',
      happeningOn: new Date().getTime(),
    };
    // Create meetup record
    before((done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .send(meetupRecord)
        .end((err, res) => {
          [meetupRecordResponse] = res.body.data;
          done();
        });
    });

    let rsvpResponse;
    const rsvpRecord = {
      user: 9,
      response: 'yes',
    };

    // Make initial rsvp request
    before((done) => {
      chai.request(app)
        .post(`/api/v1/meetups/${meetupRecordResponse.id}/rsvp`)
        .send(rsvpRecord)
        .end((err, res) => {
          [rsvpResponse] = res.body.data;
          done();
        });
    });
    it('should return error message if user has already RSVPed to a meetup', (done) => {
      chai.request(app)
        .post(`/api/v1/meetups/${rsvpResponse.meetup}/rsvp`)
        .send(rsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.forbidden);
          res.body.should.have.property('error').eql('You have already responded to this meetup');
          done();
        });
    });
    it('should return error message if meetup does not exist', (done) => {
      const fakeMeetupID = 737;
      chai.request(app)
        .post(`/api/v1/meetups/${fakeMeetupID}/rsvp`)
        .send(rsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.forbidden);
          res.body.should.have.property('error').eql('Cannot respond to a meetup that does not exist');
          done();
        });
    });
  });

  describe('response', () => {
    let meetupRecordResponse;
    // Sample valid meetup request data
    const meetupRecord = {
      location: 'Radison Blue',
      topic: 'Chess nation',
      description: 'We hold mini chess tournaments with amazing rewards.',
      happeningOn: new Date().getTime(),
    };
    // Create meetup record
    before((done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .send(meetupRecord)
        .end((err, res) => {
          [meetupRecordResponse] = res.body.data;
          done();
        });
    });
    const validRsvpRecord = {
      user: 10,
      response: 'yes',
    };

    const invalidRsvpRecord = {
      user: 11,
      response: '',
    };
    it('should return newly created rsvp record if input is valid', (done) => {
      chai.request(app)
        .post(`/api/v1/meetups/${meetupRecordResponse.id}/rsvp`)
        .send(validRsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.created);
          res.body.data[0].should.have.property('meetup');
          res.body.data[0].should.have.property('topic');
          res.body.data[0].should.have.property('status');
          done();
        });
    });
    it('should return error message if input is not valid', (done) => {
      chai.request(app)
        .post(`/api/v1/meetups/${meetupRecordResponse.id}/rsvp`)
        .send(invalidRsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          res.body.should.have.property('error').eql('Required fields are empty');
          done();
        });
    });
  });
});
