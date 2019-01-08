import uuid from 'uuid/v4';
/**
 * Meetup model that holds the Schema for meetups
 * @package Meetup
 */

class Meetup {
  constructor() {
    this.meetups = [];
    this.seeder();
    return this.meetups;
  }

  /**
   * Seed dummy meetups data into this.meetups
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
    const meetupLocations = ['Ikeja', 'Mushin', 'Gbagada', 'Ogba'];
    const meetupTopics = ['Nodejs', 'Laravel', 'Golang', 'PyConf'];
    const meetupDescriptions = ['First description', 'Second description', 'Third description', 'Fourth description'];
    const happeningOnValues = [date.getTime() + 1000,
      date.getTime() + 432,
      date.getTime() + 788,
      date.getTime() + 23,
    ];
    // Seed dummy data
    for (let i = 0; i < 4; i += 1) {
      const meetupRecord = {
        id: ids[i],
        createdOn: createdOnValues[i],
        location: meetupLocations[i],
        images: '',
        topic: meetupTopics[i],
        description: meetupDescriptions[i],
        happeningOn: happeningOnValues[i],
        tags: '',
      };
      this.meetups.push(meetupRecord);
    }
  }
}

export default new Meetup();
