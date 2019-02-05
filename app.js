import express from 'express';
import meetups from './server/v1/routes/meetups';
import questions from './server/v1/routes/questions';
import comments from './server/v1/routes/comments';
import auth from './server/v1/routes/auth';

const app = express();

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/v1', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Questioner v1',
  });
});

// Routes middleware
app.use('/api/v1/meetups', meetups);
app.use('/api/v1/questions', questions);
app.use('/api/v1/auth', auth);
app.use('/api/v1/comments', comments);

// 404 wildcard
app.get('*', (req, res) => {
  res.status(400).json({
    status: 400,
    message: 'URL not found',
  });
});

const port = process.env.PORT || 7000;

app.listen(port);

export default app;
