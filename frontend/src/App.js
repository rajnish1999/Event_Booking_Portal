import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import './App.css';
import AuthPage from './pages/Auth.js'
import BookingsPage from './pages/Bookings.js'
import EventsPage from './pages/Events.js'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from='/' to='/auth' exact />
          <Route path='/auth' component={AuthPage} />
          <Route path='/events' component={BookingsPage} />
          <Route path='/bookings' component={EventsPage} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
