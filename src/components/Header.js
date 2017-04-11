import React, { Component } from 'react';
import { Link } from 'react-router';

import './Header.css';

class Header extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <header>
        <a href="#" className="menu"><img alt="menu" src='./images/hamburger.png' height="28px"/></a>
        <a href="#" className="settings"><img alt="settings" src='./images/hamburger.png' height="28px"/></a>
      </header>
    );
  }
}

export default Header;
