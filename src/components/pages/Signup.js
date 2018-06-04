import React, {Component} from 'react';

import Preloader from "../Preloader";
import firebase from "firebase/app";


class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      role: 'funcionario',
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

    if (this.state.password === this.state.passwordConfirm) {
      this.setState({preLoad: true});

      let auth = firebase.auth();
      auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          console.log(res);
          let database = firebase.database();
          database.ref('/users')
            .push({
              email: this.state.email,
              role: this.state.role
            })
            .then(res => {
              console.log(res);
              this.props.history.push('/');
            })
            .catch(err => {
              console.log(err);
              this.setState({preLoad: false});
              alert(err.message);
            });
        })
        .catch(err => {
          console.log(err);
          this.setState({preLoad: false});
          alert(err.message);
        });
    } else {
      alert("Password don't match");
    }
  };


  render() {
    return (
      <div className="Signup container">
        <h1>Sign up</h1>
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
              <div className="input-field col s12">
                <input id="password-confirm" type="password" name="passwordConfirm" className="validate"
                       value={this.state.passwordConfirm}
                       onChange={this.onChange} required/>
                <label htmlFor="password-confirm">Password Confirm</label>
              </div>
            </div>
            <div className="row">
              <div className="col s6">
                <input id="funcionario" type="radio" className="filled-in" name="role" value="funcionario"
                       defaultChecked
                       onChange={this.onChange}/>
                <label htmlFor="funcionario">Funcionário</label>
              </div>
              <div className="col s6">
                <input id="master" type="radio" className="filled-in" name="role" value="master"
                       onChange={this.onChange}/>
                <label htmlFor="master">Master</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
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

export default Signup;