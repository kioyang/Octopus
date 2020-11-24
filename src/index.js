import React from 'react';
import ReactDom from 'react-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import AppReducers from './redux/reducers/index.js'

import App from './App';

const store = createStore(AppReducers);

ReactDom.render(
<Provider store={store}><App /></Provider>,
document.querySelector('#app'));