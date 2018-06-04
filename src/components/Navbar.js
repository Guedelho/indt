import React, {Component} from 'react';

import {NavLink} from "react-router-dom";

class Navbar extends Component {
  componentDidMount() {
    this.activeControl();
  }

  componentDidUpdate() {
    this.activeControl();
  }

  activeControl = () => {
    document.querySelector("li.active") && document.querySelector("li.active").classList.remove("active");
    document.querySelector("a.active") && document.querySelector("a.active").parentElement.classList.add("active");
  };

  render() {
    return (
      <nav>
        <div className="nav-wrapper container">
          <NavLink exact to='/' activeClassName="active" className="brand-logo">Logo</NavLink>
          {!this.props.logged ? (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <NavLink exact to='/login' activeClassName="active">Log in</NavLink>
              </li>
              <li>
                <NavLink exact to='/signup' activeClassName="active">Sign up</NavLink>
              </li>
            </ul>
          ) : (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <NavLink exact to='/album/' activeClassName="active">Create</NavLink>
              </li>
              <li>
                <a href="#" onClick={this.props.signOut}>Sign out</a>
              </li>
            </ul>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;