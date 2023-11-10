import React from 'react';
import logo from './assets/logo.svg';
import Home from './pages/Home';
import LKUINavButton from './components/LKUINavButton';
import { Home24Regular, Home24Filled, Info24Regular, Info24Filled } from '@fluentui/react-icons';
import AboutUs from './pages/AboutUs';
import './assets/fonts/typonine.css'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './style/App.css';
import Player from './pages/Player';

function App() {
  return (
    <div className="lkui-main">
      <Router>
        <div className='lkui-header'>
          <Link to='/'>
            <img src={logo} width={150}></img>
          </Link>
          <LKUINavButton path='/' regComponent={Home24Regular} filledComponent={Home24Filled} />
          <LKUINavButton path='/about-us' regComponent={Info24Regular} filledComponent={Info24Filled} />
        </div>
        <div className='lkui-App'>
          <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route path='/about-us' component={AboutUs}></Route>
            <Route path='/player/:id' component={Player}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
