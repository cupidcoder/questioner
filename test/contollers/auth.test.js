import chai from 'chai';
import app from '../../app';
import statusCodes from '../../server/helpers/status';

chai.use(require('chai-http'));

// eslint-disable-next-line no-unused-vars
const should = chai.should();


describe('POST /api/v1/auth/signup', () => {
  it('should respond with error if firstname was not filled', (done) => {
    const userObject = {
      firstname: '',
      lastname: 'ume',
      password: 'questioner40',
      email: 'chukwudi.ume@gmail.com',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should respond with error if email was not filled', (done) => {
    const userObject = {
      firstname: 'Chukwudi',
      lastname: 'ume',
      password: 'questioner40',
      email: '',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should respond with error if password was not filled', (done) => {
    const userObject = {
      firstname: 'Chukwudi',
      lastname: 'ume',
      password: '',
      email: 'c.ume@gmail.com',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should respond with error if email is invalid', (done) => {
    const userObject = {
      firstname: 'Chukwudi',
      lastname: 'ume',
      password: 'questioner40',
      email: 'a.gmail.com',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should respond with error if lastname was not filled', (done) => {
    const userObject = {
      firstname: 'Chukwudi',
      lastname: '',
      password: 'questioner40',
      email: 'chukwudi.ume@gmail.com',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should respond with token and user data if required fields were inputed', (done) => {
    const userObject = {
      firstname: 'Chukwudi',
      lastname: 'ume',
      password: '98josdnlsn',
      email: 'chukwudi.ume2@gmail.com',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.created);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('token');
        res.body.data[0].should.have.property('user');
        res.body.data[0].user.should.have.property('firstname').eql(userObject.firstname);
        res.body.data[0].user.should.have.property('lastname').eql(userObject.lastname);
        res.body.data[0].user.should.have.property('email').eql(userObject.email);
        done();
      });
  });

  it('should respond with error if email has already been used', (done) => {
    const userObject = {
      firstname: 'Chukwudi',
      lastname: 'ume',
      password: '98josdnlsn',
      email: 'chukwudi.ume2@gmail.com',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should return error if invalid/empty values are filled', (done) => {
    const userLoginBody = {
      email: '',
      password: '',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(userLoginBody)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        res.body.should.have.property('error');
        done();
      });
  });

  before((done) => {
    // Register a new user
    const userObject = {
      firstname: 'Nelson',
      lastname: 'Mandela',
      password: 'questioner40',
      email: 'nmandela@gmail.com',
    };

    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.created);
        done();
      });
  });

  it('should return error if wrong credentials are supplied', (done) => {
    const userLoginBody = {
      email: 'nmandela@gmail.com',
      password: 'questioner',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(userLoginBody)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return success, with token if correct credentials are supplied', (done) => {
    const userLoginBody = {
      email: 'nmandela@gmail.com',
      password: 'questioner40',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(userLoginBody)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('token');
        res.body.data[0].should.have.property('user');
        done();
      });
  });
});
