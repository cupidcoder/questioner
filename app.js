import express from 'express';

const app = express();

// JSON middleware
app.use(express.json());


const port = process.env.port || 7000;

app.listen(port);

// console.log(`Application is running on port ${port}`);
