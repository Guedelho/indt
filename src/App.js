import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Album from "./components/pages/Album";

import Navbar from "./components/Navbar";


import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: "AIzaSyDosjtmHVrsn7gV0eW6yhL7A89bucJzA_8",
  authDomain: "indt-71037.firebaseapp.com",
  databaseURL: "https://indt-71037.firebaseio.com",
  projectId: "indt-71037",
  storageBucket: "indt-71037.appspot.com",
  messagingSenderId: "914909222611"
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: false,
      role: 'funcionario'
    };
  };

  componentDidMount() {
    let auth = firebase.auth();
    auth.onAuthStateChanged(res => {
      console.log(res);
      if (res) {
        let database = firebase.database();
        database.ref('/users').orderByChild('email').equalTo(res.email).once('value')
          .then((snap) => {
            const {role, ...rest} = snap.val()[Object.keys(snap.val())[0]];
            console.log(role);
            this.setState({
              logged: true,
              role: role
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }

  signOut = () => {
    let auth = firebase.auth();
    auth.signOut().then(res => {
      console.log(res);
      this.setState({logged: false});
    });
  };

  render() {
    return (
      <main className="App">
        <Navbar signOut={this.signOut} logged={this.state.logged}/>
        <Switch>
          <Route exact path='/' render={(props) => <Home {...props} logged={this.state.logged} role={this.state.role}/>}/>
          <Route path='/login' render={(props) => <Login {...props} logged={this.state.logged}/>}/>
          <Route path='/signup' render={(props) => <Signup {...props} logged={this.state.logged}/>}/>
          <Route exact path='/album' render={(props) => <Album {...props} logged={this.state.logged}/>}/>
          <Route path='/album/:id' render={(props) => <Album {...props} logged={this.state.logged}/>}/>
        </Switch>
      </main>
    );
  }
}

export default App;
