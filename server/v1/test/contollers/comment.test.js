import chai from 'chai';
import app from '../../../../app';
import statusCodes from '../../helpers/status';

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

describe('DELETE /api/v1/comments/:commentID', () => {
  const commentID = 4;
  const secondCommentID = 5;
  const invalidCommentID = 99;
  const invalidToken = 'ljakjd09094234pksDAdkad?/adjJJ#$3j.jljoadiws';

  const adminUser = { // Created by DB seeder
    email: 'c.ume@gmail.com',
    password: 'questioner40',
  };

  const regularUser = {
    email: 'c.guy@gmail.com',
    password: 'questioner40',
  };

  const commentOwner = {
    email: 'e.genius@gmail.com',
    password: 'questioner40',
  };

  it('should return error if token was not provided', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${commentID}`)
      .set('x-access-token', '')
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${commentID}`)
      .set('x-access-token', invalidToken)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

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

  it('should return error if comment does not exist', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${invalidCommentID}`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if user is not comment owner', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${commentID}`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.unauthorized);
        done();
      });
  });

  let ownerLoginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(commentOwner)
      .end((err, res) => {
        [ownerLoginResponse] = res.body.data;
        done();
      });
  });

  it('should return success if user is comment owner', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${commentID}`)
      .set('x-access-token', ownerLoginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        done();
      });
  });

  let adminLoginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(adminUser)
      .end((err, res) => {
        [adminLoginResponse] = res.body.data;
        done();
      });
  });

  it('should return success if user is admin', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${secondCommentID}`)
      .set('x-access-token', adminLoginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        done();
      });
  });
});
