import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

import Preloader from "../Preloader";

import firebase from 'firebase/app';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      preLoad: true
    };
  };

  componentDidMount() {
    let database = firebase.database();

    database.ref('/albums').once('value')
      .then(snap => {
        console.log(snap.val());

        let obj = snap.val();
        let albums = [];

        let storage = firebase.storage().ref();

        for (let x in obj) {
          console.log(obj[x].capa)
          obj[x].id = x;
          storage.child(obj[x].capa).getDownloadURL()
            .then(res => {
              console.log(res)
              obj[x].capa = res;
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              albums.push(obj[x]);
              this.setState({albums: albums});
            });
        }
        console.log(this.state);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({preLoad: false});
      });
  }

  onClick = (id) => {
    console.log(id)
    let database = firebase.database();

    database.ref('/albums/').child(id).remove()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  };

  render() {
    const listAlbums = this.state.albums.map((x, i) => (
      <div key={i} className="col s3 center-align">
        <img src={x.capa} style={{maxWidth: "100%"}}/>
        <h4>{x.album}</h4>
        <p>{x.autor}</p>
        <span>{x.categoria}</span><br/><br/>
        {this.props.role === "master" && (
          <div>
            <NavLink to={"/album/" + x.id}>Editar</NavLink><br/><br/>
            <a className="waves-effect waves-light btn red" onClick={() => this.onClick(x.id)}>Excluir</a>
          </div>
        )}
      </div>
    ));
    return (
      <div className="Home container">
        <h1>Home</h1>
        {this.state.preLoad && <Preloader/>}
        <div className="row">
          {listAlbums}
        </div>
      </div>
    );
  }
}

export default Home;