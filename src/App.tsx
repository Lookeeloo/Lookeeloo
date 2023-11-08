import React from 'react';
import logo from './assets/logo.svg';
import Home from './pages/Home';
import LKUINavButton from './components/LKUINavButton';
import { Home24Regular, Home24Filled } from '@fluentui/react-icons';
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
          <LKUINavButton path='/about-us' regComponent={Home24Regular} filledComponent={Home24Filled} />
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
