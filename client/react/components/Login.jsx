import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/actions.js';

/*
loginGet: {
  valid: true,
},
*/

const mapStateToProps = state => ({
  loginGet: state.responses.loginGet,
  // username: state.textField.username,
  password: state.textField.password,
  username: state.names.username,
  validLogin: state.textField.validLogin,
  mode: state.responses.mode,
});

const mapDispatchToProps = dispatch => ({
  changeToProfilePageActionCreator: () => dispatch(actions.changeToProfilePageActionCreator()),
  usernameChangeActionCreator: () => dispatch(actions.usernameChangeActionCreator(event)),
  passwordChangeActionCreator: () => dispatch(actions.passwordChangeActionCreator(event)),
  loginSubmitActionCreator: (e, mode, serverRes) =>
    dispatch(actions.loginSubmitActionCreator(e, mode, serverRes)),
  getUsernameActionCreator: (username) => dispatch(actions.getUsernameActionCreator(username)),
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  handleAccountSubmit(e, mode, serverRes) {
    e.preventDefault();
    // console.log(e, { mode }, { serverRes });
    let queryRes;

    if (this.props.mode === 'dev') {
      // this.props.loginGet.valid = false;
      if (this.props.loginGet.valid) this.props.changeToProfilePageActionCreator();
      else this.props.loginSubmitActionCreator();
    } else {
      // queryRes = actual server query
      this.props.getUsernameActionCreator(this.state.username);

      const url = `api/gainAccess`;
      const options = {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': ' * ',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: { username: this.state.username, password: this.state.password}
      };
      fetch(url, options)
        .then(res => res.json())
        .then(data => {
          if (data.valid) this.props.changeToProfilePageActionCreator();
          else this.props.loginSubmitActionCreator();
        });
    }
  }

  render() {
    return (
      <div className="login-container" key="lic">
        <header>
          <h1>Already have an accnt?</h1>
          <p>Sign in and get brdlng!</p>
        </header>

        <form key="li-form" onSubmit={e => this.handleAccountSubmit(e)}>
          <label htmlFor="username">
            Enter username:
            <input type="text"
                   id="username"
                   name="username"
                   placeholder="enter username"
                   value = {this.state.username}
                   onChange={(e) => {this.setState({ username: e.target.value })}}
                   />
          </label>

          <label htmlFor="password">
            Enter password:
            <input type="password"
                   id="password"
                   name="password"
                  //  placeholder=""
                   value = {this.state.password}
                   onChange={(e) => {this.setState({ password: e.target.value })}}
                   />
          </label>


          <input type="submit" value='Sign In'/>
          {this.props.validLogin === false ? (
            <p className="validation-msg">Invalid username or password</p>
          ) : (
            <p className="hidden"></p>
          )};
        </form>
      </div>
    )
  };
}
        /* <form key="li-form" action="" onSubmit={e => this.handleAccountSubmit(e)}>
          <label htmlFor="username">
            <p>Username:</p>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="enter username"
              onChange={this.props.usernameChangeActionCreator}
            />
          </label>
          <label htmlFor="password">
            <p>Password:</p>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter password"
              onChange={this.props.passwordChangeActionCreator}
            />
          </label>

          <button className="login-btn" type="submit" value="Create account">
            Get brdlng
          </button>
          {this.props.validLogin === false ? (
            <p className="validation-msg">Invalid username or password</p>
          ) : (
            <p className="hidden"></p>
          )}
        </form> */


export default connect(mapStateToProps, mapDispatchToProps)(Login);
