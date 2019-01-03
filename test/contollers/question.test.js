import uuid from 'uuid/v4';
import chai, { assert } from 'chai';
import app from '../../app';
import statusCodes from '../../src/helpers/status';

chai.use(require('chai-http'));

const should = chai.should();

describe('POST /api/v1/questions', () => {
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

describe('PATCH /api/v1/questions/:id/upvote', () => {
  it('should respond with error if question does not exist', (done) => {
    const fakeQuestionID = 982;
    chai.request(app)
      .patch(`/api/v1/questions/${fakeQuestionID}/upvote`)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        res.body.should.have.property('error');
        res.body.error.should.eql('Cannot upvote question that does not exist');
        done();
      });
  });

  let questionRecordResponse;
  // Sample valid question request data
  const questionRecord = {
    createdBy: uuid(),
    meetup: uuid(),
    title: 'Item 7',
    body: 'We would really like to have an item 7',
  };
  // Create sample question record
  before((done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send(questionRecord)
      .end((err, res) => {
        [questionRecordResponse] = res.body.data;
        done();
      });
  });
  let questionUpvoteResponse;
  // Make upvote on newly created question
  before((done) => {
    chai.request(app)
      .patch(`/api/v1/questions/${questionRecordResponse.id}/upvote`)
      .end((err, res) => {
        [questionUpvoteResponse] = res.body.data;
        done();
      });
  });
  it('should increase votes by 1 after hitting upvote endpoint', () => {
    assert.equal(questionRecordResponse.votes + 1, questionUpvoteResponse.votes);
  });
});

describe('PATCH /api/v1/questions/:id/downvote', () => {
  it('should respond with error if question does not exist', (done) => {
    const fakeQuestionID = 982;
    chai.request(app)
      .patch(`/api/v1/questions/${fakeQuestionID}/downvote`)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        res.body.should.have.property('error');
        res.body.error.should.eql('Cannot downvote question that does not exist');
        done();
      });
  });

  let questionRecordResponse;
  // Sample valid question request data
  const questionRecord = {
    createdBy: uuid(),
    meetup: uuid(),
    title: 'Stickers',
    body: 'Kindly let us know if we would be getting awesome stickers',
  };
  // Create sample question record
  before((done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send(questionRecord)
      .end((err, res) => {
        [questionRecordResponse] = res.body.data;
        done();
      });
  });
  let questionDownvoteResponse;
  // Make upvote on newly created question
  before((done) => {
    chai.request(app)
      .patch(`/api/v1/questions/${questionRecordResponse.id}/upvote`)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        done();
      });
  });
  // Make downvote to set question back to zero
  beforeEach((done) => {
    // beforeEach makes the call also for the next it('', () ... );
    chai.request(app)
      .patch(`/api/v1/questions/${questionRecordResponse.id}/downvote`)
      .end((err, res) => {
        [questionDownvoteResponse] = res.body.data;
        done();
      });
  });
  it('should set votes back to 0 after hitting downvote endpoint on the same question', () => {
    assert.equal(questionRecordResponse.votes, questionDownvoteResponse.votes);
  });

  it('should never have a negative value', () => {
    assert.notEqual(questionDownvoteResponse, -1);
  });
});
