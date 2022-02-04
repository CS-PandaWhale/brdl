import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/actions.js';

const mapStateToProps = (state) => ({
  mode: state.responses.mode,
  username: state.textField.username,
  seenBirds: state.birds.seenBirds,
  localBirds: state.birds.localBirds,
  lat: state.textField.lat,
  long: state.textField.long,
  testSeenBirds: state.responses.testSeenBirds,
  testLocalBirds: state.responses.testLocalBirds,
  fullName: state.textField.fullName,
});

const mapDispatchToProps = (dispatch) => ({
  updateSeenBirdsActionCreator: (payload) =>
    dispatch(actions.updateSeenBirdsActionCreator(payload)),
  updateLocalBirdsActionCreator: (payload) =>
    dispatch(actions.updateLocalBirdsActionCreator(payload)),
  updateLocationActionCreator: (payload) => dispatch(actions.updateLocationActionCreator(payload)),
});

class UserStats extends Component {
  constructor(props) {
    super(props);

    this.getBirds = this.getBirds.bind(this);
    this.newSeenBird = this.newSeenBird.bind(this);
  }

  newSeenBird(bird) {
    if (this.props.mode === 'dev') {
      this.props.seenBirds.push({ sciName: bird, timeStamp: '5pm' });
      this.props.updateSeenBirdsActionCreator(this.props.seenBirds.slice());
    } else if (this.props.mode === 'prod') {
      bird = bird.split(' ').join('_');
      // const url = `/api/profile?username=${this.props.username}&lat=${this.props.lat}&long=${this.props.long}&sciBirdName=${bird} `;
      const user_id = 12;
      const url = `/api/profile?user_id=${user_id}&lat=${this.props.lat}&long=${this.props.long}&sciBirdName=${bird} `;

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((data) => data.json())
        .then((data) => {
          if ('sciName' in data) {
            this.props.seenBirds.push({ sciName: data.sciName, timeStamp: data.timeStamp });
            this.props.updateSeenBirdsActionCreator(this.props.seenBirds.slice());
          } else console.log('Failed to update on the back end');
        })
        .catch((err) => console.log(err));
    } else console.log('Mode must be prod or dev in ./client/reducers/responsesReducer.js');
  }

  getBirds(locInfo) {
    if (this.props.mode === 'dev') {
      this.props.updateSeenBirdsActionCreator(this.props.testSeenBirds);
      this.props.updateLocalBirdsActionCreator(this.props.testLocalBirds);
    } else if (this.props.mode === 'prod') {
      // const url = `api/profile?username=${this.props.username}&lat=${this.props.lat}&long=${this.props.long}`;
      // call to API using eric's user_id of 12
      const user_id = 12;
      const url = `api/profile?user_id=${user_id}&lat=${this.props.lat}&long=${this.props.long}`;

      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((data) => data.json())
        .then((data) => {
          data.seenBirds.forEach((bird) => (bird.sciName = bird.scientific_name));
          if ('seenBirds' in data) this.props.updateSeenBirdsActionCreator(data.seenBirds);
          this.props.updateLocalBirdsActionCreator(data.birds);
          // this.getBirdImages(data.birds);
        })
        .catch((err) => console.log(err));
    } else console.log('Mode must be prod or dev in ./client/reducers/responsesReducer.js');
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((loc) => {
      const lat = String(Math.floor(loc.coords.latitude * 100) / 100);
      const long = String(Math.floor(loc.coords.longitude * 100) / 100);
      const locInfo = {};

      locInfo.lat = lat;
      locInfo.long = long;

      this.props.updateLocationActionCreator(locInfo);
      this.getBirds();
    });
  }

  render() {
    const display = [];
    if (this.props.localBirds instanceof Array) {
      const totalSeenBirds = this.props.seenBirds.length;
      const totalBirdsInArea = this.props.localBirds.length;
      const seenBirdNames = this.props.seenBirds.reduce((acc, curr) => {
        if ('sciName' in curr) curr.sciName = curr.sciName.split('_').join(' ');
        acc[curr.sciName] = true;
        return acc;
      }, {});
      let seenBirdsInThisArea = 0;

      this.props.localBirds.forEach((bird, ind) => {
        let seen = 'Has not been seen.';
        const birdSeen = bird.sciName in seenBirdNames;
        if (birdSeen) {
          seenBirdsInThisArea++;
          seen = 'Has been seen.';
          display.push(
            <div className="bird-row-seen">
              <p
                className="bird-info"
                key={`cM${ind}`}
              >{`${bird.sciName} is in the area. ${seen}`}</p>
            </div>
          );
        } else {
          display.push(
            <div className="bird-row">
              <p
                className="bird-info"
                key={`cM${ind}`}
              >{`${bird.sciName} is in the area. ${seen}`}</p>
            </div>
          );
        }
        if (!birdSeen)
          display.push(
            <button
              className="btn"
              key={`key${ind}`}
              onClick={(e) => this.newSeenBird(bird.sciName)}
            >
              I saw {bird.sciName}!!!
            </button>
          );
      });

      display.unshift(
        <h2
          className="seen-birds-header"
          key="h2US"
        >{`You have seen ${totalSeenBirds}.\nYou have seen ${seenBirdsInThisArea} out of ${totalBirdsInArea} in the area`}</h2>
      );
    } else display.push(<h1 key="oops">Error with localBirds</h1>);

    return (
      <div key="cMD" className="component-sub-container">
        {display}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserStats);
