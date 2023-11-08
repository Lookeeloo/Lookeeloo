import React from 'react';
import logo from './assets/logo.svg';
import Home from './pages/Home';
import './assets/fonts/typonine.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './style/App.css';

function App() {
  return (
    <div className="lkui-app">
      <div className='lkui-header'>
        <img src={logo} width={130}></img>
      </div>
      <Router>
        <Switch>
          <Route exact path='/' component={Home}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
