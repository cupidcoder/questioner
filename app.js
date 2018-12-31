import express from 'express';
import meetups from './src/routes/meetups';

const app = express();

// JSON middleware
app.use(express.json());

// Routes middleware
app.use('/api/v1/meetups', meetups);


const port = process.env.port || 7000;

app.listen(port);

module.exports = app;
