import React, {Component} from 'react';
import './App.css';
import Heading from './heading/Heading';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      headers: [],
      response: {state: true},
      inputValid: false,
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let inputValid = event.target.value.match(/^\d+$/);
    this.setState({ inputValid: inputValid });
    this.setState({ number: event.target.value });
  }

  handleSubmit(event) {
    this.setState( {loading: true} );
    event.preventDefault();
    this.setState({submitPressed: true});

    fetch(`/api/page?number=${encodeURIComponent(this.state.number)}`)
      .then(response => response.json())
      .then((response) => {
        this.setState( {response: response} )
        if(response.state) {
          this.setState( {headers: response.content} )
        } else {
          this.setState( {headers: []} )
        }
        this.setState( {loading: false} );
      });
  }

  getHeadingResult() {
    if(!this.state.response.state) {
      return (
        <div className="Warning">
          <p>
            The max page number is {this.state.response.maxPageNumber}
            <br/>Please Try Again!
          </p>
        </div>
      );
    }
      
    const listOfHeadingComps = this.state.headers
      .map( function (header, index) {
        return <Heading key={index} headingList={header} />;
      });
  
    return listOfHeadingComps;
  }

  render() {
    return (
      <div className="App">
        <div className="Loader"  hidden={!this.state.loading}>
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>

        <header className="App-header">
          <h1>Rising Headings</h1>
          <p>
            This site displayes all the articles and their headings it finds on the Rising Stack Blog. 
            <br/>Enter the number of pages you want to be scanned and displayed.
          </p>

          <form onSubmit={this.handleSubmit}>
            <input
              id="number" 
              type="text"
              value={this.state.number}
              onChange={this.handleChange}
              placeholder="Number of pages..."
            />
            <button type="submit" disabled={!this.state.inputValid}>Submit</button>
          </form>
        </header>
        
        {this.getHeadingResult()}
      </div>
    );
  }
}

export default App;
