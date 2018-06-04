import React, {Component} from 'react';

import Preloader from "../Preloader";

import firebase from 'firebase/app';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      preLoad: false
    };
  };

  componentDidUpdate() {
    this.props.logged && this.props.history.push('/');
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
    console.log(this.state);
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({preLoad: true});

    let auth = firebase.auth();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        console.log(res);
        this.props.history.push('/');
      })
      .catch(err => {
        console.log(err);
        this.setState({preLoad: false});
        alert(err.message);
      });
  };

  render() {
    return (
      <div className="Login container">
        <h1>Log in</h1>
        <div className="row">
          <form className="col s12" onSubmit={this.onSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input id="email" type="email" name="email" className="validate" value={this.state.email}
                       onChange={this.onChange} required/>
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="password" type="password" name="password" className="validate" value={this.state.password}
                       onChange={this.onChange} required/>
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <a href='#'><b>Forgot Password?</b></a>
                <button className="btn waves-effect waves-light right" type="submit" name="action">Submit
                  <i className="material-icons right">send</i>
                </button>
              </div>
            </div>
            {this.state.preLoad && <Preloader/>}
          </form>
        </div>
      </div>
    );
  }
}

export default Login;