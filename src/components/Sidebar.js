import React, { Component } from 'react';
import { Link } from 'react-router';

import './Sidebar.css';

class Sidebar extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <aside>
        <div className="logo" style={{backgroundImage: `url('./images/logo.svg')`}}>
        </div>
        <h3>Main</h3>
        <ul>
          <li><img src='./images/i-icon.png' alt="info" width="18px"/><a className="active" href="#">Brand</a></li>
          <li><img src='./images/hr.png' alt="hr" width="18px"/><a href="#">Human Resources</a></li>
        </ul>
      </aside>
    );
  }
}

export default Sidebar;
