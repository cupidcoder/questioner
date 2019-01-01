import uuid from 'uuid/v4';
import chai from 'chai';
import app from '../../app';
import statusCodes from '../../src/helpers/status';

chai.use(require('chai-http'));

const should = chai.should();

describe('post question', () => {
  // Sample valid question request data
  const questionRecord = {
    createdBy: uuid(),
    meetup: uuid(),
    title: 'Transportation',
    body: 'I would like to know if there would provisions for transportation',
  };

  // sample invalid question request data
  const invalidQuestionRecord = {
    createdBy: '',
    meetup: '',
    title: '',
    body: 'I would like to know if there would provisions for transportation',
  };

  describe('response', () => {
    it('should respond with newly created question record if request is valid', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .send(questionRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.created);
          res.body.should.have.property('data');
          res.body.data[0].should.have.property('id');
          res.body.data[0].should.have.property('createdOn');
          res.body.data[0].should.have.property('createdBy');
          res.body.data[0].should.have.property('meetup');
          res.body.data[0].should.have.property('title');
          res.body.data[0].should.have.property('body');
          res.body.data[0].should.have.property('votes');
          done();
        });
    });

    it('should respond with error if request is invalid', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .send(invalidQuestionRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          res.body.should.have.property('error');
          res.body.error.should.eql('Required fields are empty');
          done();
        });
    });
  });
});