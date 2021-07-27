import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import './App.css';
import AuthPage from './pages/Auth.js'
import BookingsPage from './pages/Bookings.js'
import EventsPage from './pages/Events.js'
import MainNavigation from './components/Navigation/MainNavigation'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from='/' to='/auth' exact />
              <Route path='/auth' component={AuthPage} />
              <Route path='/bookings' component={BookingsPage} />
              <Route path='/events' component={EventsPage} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;
