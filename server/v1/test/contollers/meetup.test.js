/* eslint-disable no-unused-vars */
import chai, { assert } from 'chai';
import path from 'path';
import { readFileSync, existsSync } from 'fs';
import app from '../../../../app';
import statusCodes from '../../helpers/status';

chai.use(require('chai-http'));

// eslint-disable-next-line no-unused-vars
const should = chai.should();

describe('POST /api/v1/meetups', () => {
  // Sample valid meetup request data
  const meetupRecord = {
    location: 'Ikeja',
    topic: 'nodejs ninja',
    description: 'We discuss on issues bothering building for the next billion users',
    happeningOn: '2019-05-24 01:00',
  };

  // sample invalid meetup request data
  const invalidMeetupRecordOne = {
    location: '',
    topic: 'Node js Nigeria',
    description: 'We discuss on issues bothering building for the next billion users',
    happeningOn: '2019-05-24 01:00',
  };

  // sample invalid meetup request data - Two
  const invalidMeetupRecordTwo = {
    location: 'Gbagada',
    topic: '',
    description: 'We discuss on issues bothering building for the next billion users',
    happeningOn: '2019-05-24 01:00',
  };

  // sample invalid meetup request data - Three
  const invalidMeetupRecordThree = {
    location: 'Gbagada',
    topic: 'Building for tomorrow',
    description: 'We discuss on issues bothering building for the next billion users',
    happeningOn: '',
  };

  // sample invalid meetup request data - Four
  const invalidMeetupRecordFour = {
    location: 'Gbagada',
    topic: 'Building for tomorrow',
    description: '',
    happeningOn: '2019-05-24 01:00',
  };

  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .set('x-access-token', '')
      .send(meetupRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  describe('request', () => {
    // user to obtain user with/without admin rights - users created by DB Seeder
    const regularUser = {
      email: 'e.genius@gmail.com',
      password: 'questioner40',
    };
    const adminUser = {
      email: 'c.ume@gmail.com',
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
    it('should return error if user does not have right to create meetup', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .set('x-access-token', loginResponse.token)
        .send(meetupRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.unauthorized);
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
    it('should return sucess if user has right to create meetup', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .set('x-access-token', adminLoginResponse.token)
        .send(meetupRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.created);
          done();
        });
    });
  });

  describe('response', () => {
    const adminUser = {
      email: 'c.ume@gmail.com',
      password: 'questioner40',
    };
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
    it('should respond with newly created meetup record if request is valid', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .set('x-access-token', adminLoginResponse.token)
        .send(meetupRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.created);
          res.body.should.have.property('data');
          res.body.data[0].should.have.property('id');
          res.body.data[0].should.have.property('created_on');
          res.body.data[0].should.have.property('location');
          res.body.data[0].should.have.property('topic').eql(meetupRecord.topic);
          res.body.data[0].should.have.property('description');
          res.body.data[0].should.have.property('happening_on');
          res.body.data[0].should.have.property('tags');
          done();
        });
    });

    it('should respond with error if location is not filled', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .set('x-access-token', adminLoginResponse.token)
        .send(invalidMeetupRecordOne)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          res.body.should.have.property('error');
          done();
        });
    });

    it('should respond with error if topic is not filled', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .set('x-access-token', adminLoginResponse.token)
        .send(invalidMeetupRecordTwo)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          res.body.should.have.property('error');
          done();
        });
    });

    it('should respond with error if happeningOn is not filled', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .set('x-access-token', adminLoginResponse.token)
        .send(invalidMeetupRecordThree)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          res.body.should.have.property('error');
          done();
        });
    });

    it('should respond with error if description is not filled', (done) => {
      chai.request(app)
        .post('/api/v1/meetups')
        .set('x-access-token', adminLoginResponse.token)
        .send(invalidMeetupRecordFour)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          res.body.should.have.property('error');
          done();
        });
    });
  });
});


describe('GET /api/v1/meetups', () => {
  it('should return error if token was not provided', (done) => {
    chai.request(app)
      .get('/api/v1/meetups')
      .set('x-access-token', '')
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token provided is incorrect', (done) => {
    const sampleFakeToken = 'xoiis80909403493jnlnfsa;dn';
    chai.request(app)
      .get('/api/v1/meetups')
      .set('x-access-token', sampleFakeToken)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // Get user token
  const adminUser = {
    email: 'c.ume@gmail.com',
    password: 'questioner40',
  };

  let loginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(adminUser)
      .end((err, res) => {
        [loginResponse] = res.body.data;
        done();
      });
  });

  it('should match meetup records already seeded in the db', (done) => {
    chai.request(app)
      .get('/api/v1/meetups')
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data.length.should.be.above(1);
        res.body.data[0].should.have.property('topic').eql('NodeJS Gurus');
        res.body.data[1].should.have.property('topic').eql('Food Lovers');
        res.body.data[2].should.have.property('topic').eql('Movie Critics');
        done();
      });
  });
});

describe('GET /api/v1/meetups/:id', () => {
  describe('Token error', () => {
    it('should return error if token was not provided', (done) => {
      chai.request(app)
        .get('/api/v1/meetups/1')
        .set('x-access-token', '')
        .end((err, res) => {
          res.should.have.status(statusCodes.forbidden);
          done();
        });
    });

    it('should return error if token provided is incorrect', (done) => {
      const sampleFakeToken = 'xoiis80909403493jnlnfsa;dn';
      chai.request(app)
        .get('/api/v1/meetups/1')
        .set('x-access-token', sampleFakeToken)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          done();
        });
    });
  });

  // Get user token
  const adminUser = {
    email: 'c.ume@gmail.com',
    password: 'questioner40',
  };

  let loginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(adminUser)
      .end((err, res) => {
        [loginResponse] = res.body.data;
        done();
      });
  });

  // Sample valid meetup request data
  const meetupRecord = {
    location: 'Ogba',
    topic: 'Book club',
    description: 'We discuss on issues bothering building for the next billion users',
    happeningOn: '2019-05-24 01:00',
  };

  // meetupRecord response
  let meetupRecordResponse;

  // Make POST request to save meetup
  before((done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .set('x-access-token', loginResponse.token)
      .send(meetupRecord)
      .end((err, res) => {
        [meetupRecordResponse] = res.body.data;
        done();
      });
  });
  it('should return error parameter is not a valid number', (done) => {
    chai.request(app)
      .get('/api/v1/meetups/someText')
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });
  it('should return meetup with same id if meetup record exists', (done) => {
    // Make GET request to get saved meetup
    chai.request(app)
      .get(`/api/v1/meetups/${meetupRecordResponse.id}`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('id').eql(meetupRecordResponse.id);
        done();
      });
  });

  it('should return 404 if meetup record does not exist', (done) => {
    // Non-existing id
    const id = 80;
    chai.request(app)
      .get(`/api/v1/meetups/${id}`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.notFound);
        res.body.should.have.property('error');
        done();
      });
  });
});

describe('GET /api/v1/meetups/upcoming', () => {
  describe('Token error', () => {
    it('should return error if token was not provided', (done) => {
      chai.request(app)
        .get('/api/v1/meetups/upcoming')
        .set('x-access-token', '')
        .end((err, res) => {
          res.should.have.status(statusCodes.forbidden);
          done();
        });
    });

    it('should return error if token provided is incorrect', (done) => {
      const sampleFakeToken = 'xoiis80909403493jnlnfsa;dn';
      chai.request(app)
        .get('/api/v1/meetups/upcoming')
        .set('x-access-token', sampleFakeToken)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          done();
        });
    });
  });
  // Get user token
  const adminUser = {
    email: 'c.ume@gmail.com',
    password: 'questioner40',
  };

  let loginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(adminUser)
      .end((err, res) => {
        [loginResponse] = res.body.data;
        done();
      });
  });
  let upcomingMeetups;
  it('should return all meetups in ascending order by happeningOn property timestamp', (done) => {
    // DB seeder for meetup is already created in descending order for some time last year
    // so it always comes up first after sorting for this test
    chai.request(app)
      .get('/api/v1/meetups/upcoming')
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.data[0].should.have.property('topic').eql('Movie Critics');
        res.body.data[1].should.have.property('topic').eql('Food Lovers');
        res.body.data[2].should.have.property('topic').eql('NodeJS Gurus');
        done();
      });
  });
});

describe('DELETE /api/v1/meetups/:meetupID', () => {
  const meetupID = 1; // Created by DB seeder
  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .delete(`/api/v1/meetups/${meetupID}`)
      .set('x-access-token', '')
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    const sampleFakeToken = 'oioad980902.23klaewqwef';
    chai.request(app)
      .delete(`/api/v1/meetups/${meetupID}`)
      .set('x-access-token', sampleFakeToken)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  describe('request', () => {
    // user to obtain user with/without admin rights - users created by DB Seeder
    const regularUser = {
      email: 'e.genius@gmail.com',
      password: 'questioner40',
    };
    const adminUser = {
      email: 'c.ume@gmail.com',
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
    it('should return error if user does not have right to delete meetup', (done) => {
      chai.request(app)
        .delete(`/api/v1/meetups/${meetupID}`)
        .set('x-access-token', loginResponse.token)
        .end((err, res) => {
          res.should.have.status(statusCodes.unauthorized);
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
    it('should return success if user has right to delete meetup', (done) => {
      chai.request(app)
        .delete(`/api/v1/meetups/${meetupID}`)
        .set('x-access-token', adminLoginResponse.token)
        .end((err, res) => {
          res.should.have.status(statusCodes.success);
          done();
        });
    });
    it('should return error if meetup is not found', (done) => {
      const meetupDeletedInTestSuite = 1;
      chai.request(app)
        .delete(`/api/v1/meetups/${meetupDeletedInTestSuite}`)
        .set('x-access-token', adminLoginResponse.token)
        .end((err, res) => {
          res.should.have.status(statusCodes.notFound);
          done();
        });
    });
  });
});

describe('POST /api/v1/meetups/:id/rsvp', () => {
  const meetupID = 2; // Created by DB seeder
  const validRsvpRecord = {
    response: 'yes',
  };

  const invalidRsvpRecord = {
    response: '',
  };
  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .post(`/api/v1/meetups/${meetupID}/rsvp`)
      .set('x-access-token', '')
      .send(validRsvpRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    const sampleFakeToken = 'oioad980902.23klaewqwef';
    chai.request(app)
      .post(`/api/v1/meetups/${meetupID}/rsvp`)
      .set('x-access-token', sampleFakeToken)
      .send(validRsvpRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // user to obtain token - users created by DB Seeder
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
  describe('request', () => {
    it('should return error message if meetup does not exist', (done) => {
      const fakeMeetupID = 737;
      chai.request(app)
        .post(`/api/v1/meetups/${fakeMeetupID}/rsvp`)
        .set('x-access-token', loginResponse.token)
        .send(validRsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.forbidden);
          done();
        });
    });
  });

  describe('response', () => {
    it('should return newly created rsvp record if input is valid', (done) => {
      chai.request(app)
        .post(`/api/v1/meetups/${meetupID}/rsvp`)
        .set('x-access-token', loginResponse.token)
        .send(validRsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.created);
          res.body.data[0].should.have.property('meetup_id');
          res.body.data[0].should.have.property('topic').eql('Food Lovers'); // from db seeder
          res.body.data[0].should.have.property('status');
          done();
        });
    });
    it('should return error if same user attempts to rsvp to the same meetup', (done) => {
      chai.request(app)
        .post(`/api/v1/meetups/${meetupID}/rsvp`)
        .set('x-access-token', loginResponse.token)
        .send(validRsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.forbidden);
          done();
        });
    });
    it('should return error message if input is not valid', (done) => {
      chai.request(app)
        .post(`/api/v1/meetups/${meetupID}/rsvp`)
        .set('x-access-token', loginResponse.token)
        .send(invalidRsvpRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.badRequest);
          done();
        });
    });
  });
});

describe('PATCH /api/v1/meetups/:id/tags', () => {
  const tagsObject = {
    tags: ['Programming', 'Software development'],
  };
  const invalidTagsObj = {
    tags: [],
  };
  const fakeToken = 'liojlklaodoie123DSDD.laodiw!!lljad';
  const meetupID = 3; // As created by the DB seeder
  const fakeMeetupID = 99;

  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .patch(`/api/v1/meetups/${meetupID}/tags`)
      .set('x-access-token', '')
      .send(tagsObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    chai.request(app)
      .patch(`/api/v1/meetups/${meetupID}/tags`)
      .set('x-access-token', fakeToken)
      .send(tagsObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // user to obtain user with/without admin rights - users created by DB Seeder
  const regularUser = {
    email: 'e.genius@gmail.com',
    password: 'questioner40',
  };
  const adminUser = {
    email: 'c.ume@gmail.com',
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
  it('should return error if user does not have right to add tags', (done) => {
    chai.request(app)
      .patch(`/api/v1/meetups/${meetupID}/tags`)
      .set('x-access-token', loginResponse.token)
      .send(tagsObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.unauthorized);
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

  it('should return error if tags is empty', (done) => {
    chai.request(app)
      .patch(`/api/v1/meetups/${meetupID}/tags`)
      .set('x-access-token', adminLoginResponse.token)
      .send(invalidTagsObj)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should return error if meetup does not exist', (done) => {
    chai.request(app)
      .patch(`/api/v1/meetups/${fakeMeetupID}/tags`)
      .set('x-access-token', adminLoginResponse.token)
      .send(tagsObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return meetup with newly posted tags', (done) => {
    chai.request(app)
      .patch(`/api/v1/meetups/${meetupID}/tags`)
      .set('x-access-token', adminLoginResponse.token)
      .send(tagsObject)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('tags');
        res.body.data[0].tags[0].should.eql('Programming');
        res.body.data[0].tags[1].should.eql('Software development');
        done();
      });
  });
});

// describe('PATCH /api/v1/meetups/:meetupID/images', () => {
//   const testFilePath = '../stubs/images/test.jpg';
//   const imageName = 'test.jpg';
//   const fakeToken = 'liojlklaodoie123DSDD.laodiw!!lljad';
//   const meetupID = 3; // As created by the DB seeder
//   const invalidMeetupID = 99;

//   it('should return error if token is not provided', (done) => {
//     chai.request(app)
//       .patch(`/api/v1/meetups/${meetupID}/images`)
//       .set('x-access-token', '')
//       .attach('images', readFileSync(path.resolve(__dirname, testFilePath)), imageName)
//       .end((err, res) => {
//         res.should.have.status(statusCodes.forbidden);
//         done();
//       });
//   });

//   it('should return error if token is invalid', (done) => {
//     chai.request(app)
//       .patch(`/api/v1/meetups/${meetupID}/images`)
//       .set('x-access-token', fakeToken)
//       .attach('images', readFileSync(path.resolve(__dirname, testFilePath)), imageName)
//       .end((err, res) => {
//         res.should.have.status(statusCodes.badRequest);
//         done();
//       });
//   });

//   // user to obtain user with/without admin rights - users created by DB Seeder
//   const regularUser = {
//     email: 'e.genius@gmail.com',
//     password: 'questioner40',
//   };
//   const adminUser = {
//     email: 'c.ume@gmail.com',
//     password: 'questioner40',
//   };
//   let loginResponse;
//   before((done) => {
//     chai.request(app)
//       .post('/api/v1/auth/login')
//       .send(regularUser)
//       .end((err, res) => {
//         [loginResponse] = res.body.data;
//         done();
//       });
//   });

//   it('should return error if user does not have right to add images', (done) => {
//     chai.request(app)
//       .patch(`/api/v1/meetups/${meetupID}/images`)
//       .set('x-access-token', loginResponse.token)
//       .attach('images', readFileSync(path.resolve(__dirname, testFilePath)), imageName)
//       .end((err, res) => {
//         res.should.have.status(statusCodes.unauthorized);
//         done();
//       });
//   });
//   let adminLoginResponse;
//   before((done) => {
//     chai.request(app)
//       .post('/api/v1/auth/login')
//       .send(adminUser)
//       .end((err, res) => {
//         [adminLoginResponse] = res.body.data;
//         done();
//       });
//   });

//   it('should return error if no image was selected', (done) => {
//     chai.request(app)
//       .patch(`/api/v1/meetups/${meetupID}/images`)
//       .set('x-access-token', adminLoginResponse.token)
//       .attach('images', '', '')
//       .end((err, res) => {
//         res.should.have.status(statusCodes.badRequest);
//         done();
//       });
//   });

//   it('should return error if meetup does not exist', (done) => {
//     chai.request(app)
//       .patch(`/api/v1/meetups/${invalidMeetupID}/images`)
//       .set('x-access-token', adminLoginResponse.token)
//       .attach('images', readFileSync(path.resolve(__dirname, testFilePath)), imageName)
//       .end((err, res) => {
//         res.should.have.status(statusCodes.forbidden);
//         done();
//       });
//   });

//   it('should return success if user has the right to add images', (done) => {
//     chai.request(app)
//       .patch(`/api/v1/meetups/${meetupID}/images`)
//       .set('x-access-token', adminLoginResponse.token)
//       .attach('images', readFileSync(path.resolve(__dirname, testFilePath)), imageName)
//       .end((err, res) => {
//         res.should.have.status(statusCodes.success);
//         done();
//       });
//   });
// });

describe('GET /api/v1/meetups/:meetupID/questions', () => {
  const meetupID = 3;
  const fakeMeetupID = 99;
  const invalidToken = 'lisjd009223klkj.josidjd002ja//ljalekq123';

  it('should return error if no token was provided', (done) => {
    chai.request(app)
      .get(`/api/v1/meetups/${meetupID}/questions`)
      .set('x-access-token', '')
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if provided token is invalid', (done) => {
    chai.request(app)
      .get(`/api/v1/meetups/${meetupID}/questions`)
      .set('x-access-token', invalidToken)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // user to obtain user with/without admin rights - users created by DB Seeder
  const regularUser = {
    email: 'e.genius@gmail.com',
    password: 'questioner40',
  };

  // obtain token
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

  it('should error if meetup does not exist', (done) => {
    chai.request(app)
      .get(`/api/v1/meetups/${fakeMeetupID}/questions`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return all available questions in the database', (done) => {
    chai.request(app)
      .get(`/api/v1/meetups/${meetupID}/questions`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.success);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('title').eql('Item 7');
        res.body.data[1].should.have.property('title').eql('Item 7 again');
        res.body.data[2].should.have.property('title').eql('Stickers');
        done();
      });
  });
});
