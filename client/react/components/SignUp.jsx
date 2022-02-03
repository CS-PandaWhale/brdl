import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/actions.js';
// import birdies from '../../../assets/img/brdl-logo-6-a.png';

const displayMessage = [];

const mapStateToProps = (state) => ({
  username: state.names.username,
  // password: state.textField.password,
  fullName: state.names.fullName,
  validUser: state.textField.validUser,
  mode: state.responses.mode,
  signUpPost: state.responses.signUpPost,
});

const mapDispatchToProps = (dispatch) => ({
  usernameChangeActionCreator: () => dispatch(actions.usernameChangeActionCreator(event)),
  passwordChangeActionCreator: () => dispatch(actions.passwordChangeActionCreator(event)),
  fullNameChangeActionCreator: () => dispatch(actions.fullNameChangeActionCreator(event)),
  createAccountSubmitActionCreator: (e, mode, serverRes) =>
    dispatch(actions.createAccountSubmitActionCreator(e, mode, serverRes)), // remove server res argument when not needed
  changeToLoginPageActionCreator: () => dispatch(actions.changeToLoginPageActionCreator()),
  changeToProfilePageActionCreator: () => dispatch(actions.changeToProfilePageActionCreator()),
  getUsernameActionCreator: (username) => dispatch(actions.getUsernameActionCreator(username)),
  getFullNameActionCreator: (fullName) => dispatch(actions.getFullNameActionCreator(fullName)),
});

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fullName: '',
    }
    this.handleAccountSubmit = this.handleAccountSubmit.bind(this);
  }

  handleAccountSubmit(e, mode, serverRes) {
    e.preventDefault();
    // console.log(e, { mode }, { serverRes });
    let queryRes;

    //------------------
    this.props.getUsernameActionCreator(this.state.username);
    this.props.getFullNameActionCreator(this.state.fullName);
    //-------------------


    if (this.props.mode === 'dev') {
      // this.props.signUpPost.valid = false;
      if (this.props.signUpPost.valid) this.props.changeToProfilePageActionCreator();
      else this.props.createAccountSubmitActionCreator();
    } else {
      // queryRes = actual server query
      const url = `/api/gainAccess`;
      // console.log(this.props.username, this.props.password, this.props.fullName);
      const options = {
        method: 'POST',
        headers: { 'Access-Control-Allow-Origin': ' * ', 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.state.username, password: this.state.password, fullname: this.state.fullName}),
      };
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) this.props.changeToProfilePageActionCreator();
          else this.props.createAccountSubmitActionCreator();
        });
    }

    /*
    /gainAccess* 
  Get or Post
  /gainAccess?username=value&password=value
  { username: value, password: value }
  response = { valid: boolean }
  */

    // queryRes.valid = false;

    // console.log(queryRes);
  }

  render() {
    // if (this.props.validUser === false) displayMessage.push(<p>Incorrect username or password</p>);
    // console.log(displayMessage);
    // console.log(this.props);

    return (
      <div className="signup-container" key="suc">
        <header>
          <h1>New to brd wtchng?</h1>
          <p>Create a brdl account and get started today!</p>
        </header>

        <form onSubmit={(e) => this.handleAccountSubmit(e)}>
          <label>
            Create a username:
            <input
              type="text"
              id="username"
              name="username"
              placeholder="enter username"
              value = {this.state.username}
              onChange={(e) => {this.setState({ username: e.target.value });
                                /*this.props.usernameChangeActionCreator}*/}}
            />
          </label>
          <label>
            Create a password:
            <input
              type="password"
              id="password"
              name="password"
              // placeholder="enter password"
              value = {this.state.password}
              onChange={(e) => {this.setState({ password: e.target.value })}}
            />
          </label>
          <label>
            Full Name:
            <input
              type="text"
              id="full-name"
              name="full-name"
              placeholder="enter full name"
              value = {this.state.fullName}
              onChange={(e) => {this.setState({ fullName: e.target.value });
                                /* this.props.fullNameChangeActionCreator */}}
            />
          </label>
          <input type="submit" value='Create Account'/>
        </form>

        {/* <form action="" onSubmit={(e) => this.handleAccountSubmit(e)}>
          <label htmlFor="username">
            <p>Create a username:</p>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="enter username"
              onChange={this.props.usernameChangeActionCreator}
            />
          </label>
          <label htmlFor="password">
            <p>Create a password:</p>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter password"
              onChange={this.props.passwordChangeActionCreator}
            />
          </label>
          <label htmlFor="full-name">
            <p>Full Name:</p>
            <input
              type="text"
              id="full-name"
              name="full-name"
              placeholder="enter full name"
              onChange={this.props.fullNameChangeActionCreator}
            />
          </label>
          <button className="create-account-btn" type="submit" value="Create account">
            Create account
          </button>
          {this.props.validUser === false ? (
            <p className="validation-msg">Username is already taken</p>
          ) : (
            <p className="hidden" />
          )}
        </form> */}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);