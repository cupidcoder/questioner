import chai from 'chai';
import app from '../../app';
import statusCodes from '../../server/helpers/status';

chai.use(require('chai-http'));

// eslint-disable-next-line no-unused-vars
const should = chai.should();


describe('POST /api/v1/auth/signup', () => {
  it('should respond with error if required fields are not filled', (done) => {
    const userObject = {
      firstname: 'Chukwudi',
      lastname: 'ume',
      password: '',
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
      email: 'chukwudi.ume@gmail.com',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('token');
        res.body.data[0].should.have.property('user');
        done();
      });
  });
});
