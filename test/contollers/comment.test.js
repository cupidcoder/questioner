import chai from 'chai';
import app from '../../app';
import statusCodes from '../../server/helpers/status';

chai.use(require('chai-http'));

// eslint-disable-next-line no-unused-vars
const should = chai.should();

describe('POST /api/v1/comments', () => {
  const commentRecord = {
    comment: 'comment test',
    questionID: 1,
  };
  const commentRecordWithInvalidQuestion = {
    comment: 'comment test',
    questionID: 99,
  };
  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/comments')
      .set('x-access-token', '')
      .send(commentRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    const sampleFakeToken = 'oioad980902.23klaewqwef';
    chai.request(app)
      .post('/api/v1/comments')
      .set('x-access-token', sampleFakeToken)
      .send(commentRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // login user
  // user to obtain user with/without admin rights - users created by DB Seeder
  const regularUser = {
    email: 'e.genius@gmail.com',
    password: 'questioner40',
  };

  let loginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(regularUser)
      .end((err, res) => {
        [loginResponse] = res.body.data;
        done();
      });
  });

  it('should create a comment record in the database', (done) => {
    chai.request(app)
      .post('/api/v1/comments')
      .set('x-access-token', loginResponse.token)
      .send(commentRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.created);
        res.body.data[0].should.have.property('comment').eql('comment test');
        done();
      });
  });

  it('should return error if question does not exist', (done) => {
    chai.request(app)
      .post('/api/v1/comments')
      .set('x-access-token', loginResponse.token)
      .send(commentRecordWithInvalidQuestion)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });
});
