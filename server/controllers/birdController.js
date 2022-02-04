const { query } = require('express');
const axios = require('axios');
const db = require('../models/brdlModels');
const tokens = require('../tokens/tokens');

const birdController = {};

// GET -- client will provide { username: value, lat: value, long: value } in req.query
// respond with 10 birds in area { birds: [ { comBirdName: value, sciBirdName: value }, {...}, ... ],

birdController.nearby = async (req, res, next) => {
  // lat/long must be up to 2 decimal points
  try {
    console.log(req.query);
    let { user_id, lat, long } = req.query;
    lat = Number(lat);
    long = Number(long);
    const apiResponse = await axios.get(
      // `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${long}&maxResults=5`,
      `https://api.ebird.org/v2/data/obs/US-CA/recent?&maxResults=10`,
      {
        headers: { 'X-eBirdApiToken': tokens.eBirdToken },
      }
    );
    console.log(apiResponse);
    const newBirdList = apiResponse.data.map((bird) => ({
      sciName: bird.sciName,
      comName: bird.comName,
      locName: bird.locName,
    }));
    const seenQuery = `SELECT scientific_name, time_stamp FROM seen_birds WHERE user_id = $1;`;
    const seenResult = await db.query(seenQuery, [user_id]);
    res.locals.nearby = { birds: newBirdList, seenBirds: seenResult.rows };
    // INSERTING ONE BY ONE
    const queryString = `INSERT INTO birds (scientific_name, common_name) VALUES ($1, $2) ON CONFLICT (scientific_name) DO NOTHING;`;
    newBirdList.forEach(async (bird) => {
      try {
        await db.query(queryString, [bird.sciName, bird.comName]);
      } catch (err) {
        console.log('Cannot insert bird into Birds table');
        console.log(err);
      }
    });

    // INSERTING ALL AT ONCE IGNORE DUPLICATES (error- if bird name contains single quote, need to add escape character to ignore)
    // const queryStart = 'INSERT INTO Birds (scientific_name, common_name) VALUES ';
    // const queryMid = newBirdList.map(bird => {
    //     return `("${bird.sciName}", "${bird.comName}")`
    // }).join(', ');
    // const queryEnd = ' ON CONFLICT (scientific_name) DO NOTHING';
    // const queryString = queryStart + queryMid + queryEnd;
    // db.query(queryString)
    // .then(() => console.log('successfully added'));

    return next();
  } catch (err) {
    return next({
      log: `Express error handler caught in birdController.nearby: ${err.message}`,
      status: 500,
      message: { err: 'Express error handler caught in birdController.nearby' },
    });
  }
};

// POST -- when user clicks on a bird they have seen in the area, client will provide username, lat/long, timeStamp, commBirdName, sciBirdName
// querey database to insert bird into the database
birdController.seen = async (req, res, next) => {
  try {
    const { user_id, sciBirdName } = req.query;
    sciBirdName.split('_').join(' ');
    // check if the bird exists in birds table, if it doesn't insert into birds table
    const queryString = `SELECT * FROM birds WHERE scientific_name = $1`;
    const queryResult = await db.query(queryString, [sciBirdName]);
    if (!queryResult.rows.length) {
      const queryInsert = `INSERT INTO birds (scientific_name, common_name) VALUES ($1, 'unknown')`;
      await db.query(queryInsert, [sciBirdName]);
      console.log('BIRD ADDED TO TABLE');
    }
    // insert into the seen_bird table username, bird see, and time seen
    const querySeen = `INSERT INTO seen_birds (user_id, scientific_name, time_stamp) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING time_stamp`;
    const seenResult = await db.query(querySeen, [user_id, sciBirdName]);
    const timeSeen = seenResult.rows[0].time_stamp;
    res.locals.seen = { sciName: sciBirdName, timeStamp: timeSeen };

    const queryCommon = `SELECT birds.common_name, birds.scientific_name FROM birds LEFT OUTER JOIN seen_birds ON birds.scientific_name = seen_birds.scientific_name`;
    

    return next();
  } catch (err) {
    return next({
      log: `Express error handler caught in birdController.seen: ${err.message}`,
      status: 500,
      message: { err: 'Express error handler caught in birdController.seen' },
    });
  }
};

//   const queryString = `INSERT INTO Birds (scientific_name, common_name) VALUES ($1, $2)`
// const queryResult = await db.query(queryString, [newBirdList.sciName,  ]);
// may need to insert 10 birds into db here, but will need to ensure scientific_name type is set to UNIQUE
//

// DELETE -- when a user "unclicks" a bird they have seen, client will provide username, sciBirdName
// we will respond with T/F if bird was successfully deleted from database

module.exports = birdController;
