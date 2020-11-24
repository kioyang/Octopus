import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import MenuLayout from './layout/MenuLayout.jsx';
import Home from './pages/Home/index.jsx';
import Create from './pages/Home/Create/index.jsx';
import ProjectEdit from './pages/Home/ProjectEdit.jsx';

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Product = () => (
  <div>
    <h2>Product</h2>
  </div>
)

class App extends Component {
  render() {
    return (
      <Router>
        <MenuLayout>
        <Route path="/" exact component={Home}></Route>
        <Route path="/new" exact component={Create}></Route>
          <Route path="/edit" component={ProjectEdit}></Route>
          <Route path="/test" component={Product}></Route>
        </MenuLayout>
      </Router>
    );
  }
}

export default App;