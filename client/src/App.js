import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import Compare from './pages/Compare';
import Tracking from './pages/Tracking';
import Management from './pages/Management';

class App extends Component {

  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/compare' component={Compare}/>
          <Route path='/track' component={Tracking}/>
          <Route path='/manage' component={Management}/>
        </Switch>
      </div>
    )
    return (
      <div>
        <App/>
      </div>
    );
  }
}

export default App;