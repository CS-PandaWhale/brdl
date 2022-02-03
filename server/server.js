const path = require('path');
const express = require('express');
const cors = require('cors');

const PORT = 3000;
const app = express();

const userController = require('./controllers/userController');
const geoController = require('./controllers/geoController');
const birdController = require('./controllers/birdController');

app.use(express.json()); // replaces body-parser
app.use(express.urlencoded({ extended: true })); // Helps parse different data types
app.use(cors());

// handle GET & POST requests to /gainAccess

// Login route
// middleware will return a boolean.
// if false, res.send('Login credentials are invalid')
// else, direct user to the profile page
app.post('/api/login', userController.auth, (req, res) => {
  res.status(200).json(res.locals.auth);
});

// Account creation
// mw will return a boolean
// if false, res.send('Account creation failed')
// else, direct user to profile page
app.post('/api/gainAccess', userController.create, (req, res) => {
  res.status(200).json(res.locals.auth);
});

// User profile - get local birds in current area
// client will send a GET request to /profile with { username: value, lat: value, long: value }
// for 10 birds, mw will return { birds: [{sciName: "", locName: ""}, {...}]}
app.get('/profile', birdController.nearby, (req, res) => {
  res.status(200).json(res.locals.nearby);
});

app.post('/profile', birdController.seen, (req, res) => {
  res.status(200).json(res.locals.seen);
});

// Local error handler (404/missing routes)
app.use('*', (req, res) => {
  res.status(404).send('PAGE NOT FOUND!!!');
});
// Global error handler (middleware errors)
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'Express error handler caught unknown middleware error' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);

  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log('Server listening on PORT', PORT);
});

module.exports = app;
