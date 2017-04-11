import React, { Component } from 'react';
import { Link } from 'react-router';
import './Querier.css';

class Querier extends Component {
  constructor(props) {
    super();
    this.state = {
      query:''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({query: event.target.value})
  }

  render() {
    return (
      <div className="querier-container">
        <input type="text" placeholder="Search..." onChange={this.handleChange}/>
        <Link className="search-button" to={`/dashboard/${this.state.query}`}>
          <img src='./images/magnifying-glass.png' alt="search_button" />
        </Link>
      </div>
    );
  }
}

export default Querier;
