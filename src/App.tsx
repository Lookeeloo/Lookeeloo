import React from 'react';
import logo from './assets/logo.svg';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import './assets/fonts/typonine.css'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './style/App.css';

function App() {
  return (
    <div className="lkui-app">
      <Router>
        <div className='lkui-header'>
          <Link to='/'>
            <img src={logo} width={150}></img>
          </Link>
        </div>
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route path='/about-us' component={AboutUs}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
