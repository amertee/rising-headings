import React, {Component} from 'react';
import './Heading.css';

class Heading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const headingList = this.props.headingList;

    let title = "";
    const listOfHeadings = headingList.map( function (heading, index) {
      if(index === 0) {
        title = heading;
        return false;
      }
        return <li key={index}>{heading}</li>;
    });

    return (
      <article>
        <h1>{title}</h1>
        <ul>{listOfHeadings}</ul>
      </article>
    );
  }
}

export default Heading;