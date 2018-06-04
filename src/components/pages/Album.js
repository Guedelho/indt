import React, {Component} from 'react';

import Preloader from "../Preloader";

import {Autocomplete} from 'react-materialize';

import firebase from 'firebase/app';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      titulo: '',
      album: '',
      categoria: '',
      autor: '',
      dataCategoria: '',
      dataAutor: '',
      preLoad: true
    };
  };

  componentDidMount() {
    let database = firebase.database();
    console.log(this.props.match.params)

    console.log(this.props.match.params.id)
    if (this.props.match.params.id) {
      database.ref('/albums/' + this.props.match.params.id).once('value')
        .then((snap) => {
          console.log(snap.val());
          this.setState({
            ...snap.val(),
            preLoad: false
          })
        })
        .catch(err => {
          console.log(err);
        });
    }
    database.ref('/author').once('value')
      .then((snap) => {
        console.log(snap.val());
        this.setObj("dataAutor", snap.val());
      })
      .catch(err => {
        console.log(err);
      });

    database.ref('/category').once('value')
      .then((snap) => {
        console.log(snap.val());
        this.setObj("dataCategoria", snap.val());
      })
      .catch(err => {
        console.log(err);
      });
  }

  setObj = (key, obj) => {
    let options = {};
    for (let x in obj) {
      options[obj[x].name] = null;
      console.log(options)
    }
    this.setState({[key]: options, preLoad: false});
  };

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
    console.log(this.state);
  };

  onCategoriaC = (e) => {
    e.target.value && this.setState({categoria: e.target.value});
  };

  onCategoriaA = (value) => {
    this.setState({categoria: value});
  };

  onAutorC = (e) => {
    e.target.value && this.setState({autor: e.target.value});
  };

  onAutorA = (value) => {
    this.setState({autor: value});
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({preLoad: true});

    let image = document.getElementById("image").files[0];

    let storage = firebase.storage().ref().child('/images/' + image.name);

    storage.put(image).then(res => {
      console.log(res);
      let database = firebase.database();
      database.ref('/albums')
        .push({
          titulo: this.state.titulo,
          album: this.state.album,
          categoria: this.state.categoria,
          autor: this.state.autor,
          capa: res.metadata.fullPath
        })
        .then(res => {
          console.log(res);

          database.ref('/author')
            .push({
              name: this.state.autor
            })
            .then((res) => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });

          database.ref('/category')
            .push({
              name: this.state.categoria
            })
            .then((res) => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
          this.setState({preLoad: false});
          alert(err.message);
        })
        .finally(() => {
          this.props.history.push('/');
        });
    }).catch(err => {
      console.log(err);
      this.setState({preLoad: false});
      alert(err.message);
    });
  };

  render() {
    return (
      <div className="Home container">
        <h1>Album</h1>
        <form className="col s12" onSubmit={this.onSubmit}>
          <div className="row">
            <div className="input-field col s12">
              <input id="titulo" type="text" name="titulo" className="validate" value={this.state.titulo}
                     onChange={this.onChange} required/>
              <label htmlFor="titulo">Título</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input id="album" type="text" name="album" className="validate" value={this.state.album}
                     onChange={this.onChange} required/>
              <label htmlFor="album">Album</label>
            </div>
          </div>
          {this.state.dataCategoria &&
          <Autocomplete title="Categoria" data={this.state.dataCategoria} onChange={this.onCategoriaC}
                        value={this.state.categoria}
                        onAutocomplete={this.onCategoriaA}/>}
          {this.state.dataAutor &&
          <Autocomplete title="Autor" data={this.state.dataAutor} onChange={this.onAutorC} value={this.state.autor}
                        onAutocomplete={this.onAutorA}/>}
          <div className="file-field input-field">
            <div className="btn">
              <span>Capa</span>
              <input id="image" type="file" accept=".jpg, .png" name="capa" required/>
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" required value={this.state.capa}/>
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
    );
  }
}

export default Home;