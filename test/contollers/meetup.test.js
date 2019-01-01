import chai from 'chai';
import app from '../../app';

chai.use(require('chai-http'));

const should = chai.should();

describe('create meetup record', () => {
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
          res.should.have.status(201);
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
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.eql('Required fields are empty');
          done();
        });
    });
  });
});


describe('get all meetup records', () => {
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
        res.should.have.status(201);
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
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.length.should.be.above(1);
        done();
      });
  });
});
