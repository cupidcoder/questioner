import uuid from 'uuid/v4';
/**
 * Question model that holds the Schema for questions
 * @package Question
 */

class Question {
  constructor() {
    this.questions = [];
    this.seeder();
    return this.questions;
  }

  /**
   * Seed dummy questions data into this.questions
   */
  seeder() {
    // Dummy data
    const ids = [uuid(), uuid(), uuid(), uuid()];
    const date = new Date();
    const createdOnValues = [date.getTime(),
      date.getTime() + 1,
      date.getTime() + 2,
      date.getTime() + 3,
    ];
    const createdByValues = [uuid(), uuid(), uuid(), uuid()];
    const meetupIDs = [uuid(), uuid(), uuid(), uuid()];
    const questionTitles = ['First title', 'Second title', 'Third title', 'Fourth title'];
    const questionBodyValues = ['First body', 'Second body', 'Third body', 'Fourth body'];
    // Seed dummy data
    for (let i = 0; i < 4; i += 1) {
      const questionRecord = {
        id: ids[i],
        createdOn: createdOnValues[i],
        createdBy: createdByValues[i],
        meetup: meetupIDs[i],
        title: questionTitles[i],
        body: questionBodyValues[i],
        votes: 0,
      };
      this.questions.push(questionRecord);
    }
  }
}

export default new Question();
