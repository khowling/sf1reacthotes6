'use strict';


import './index.html';
import './scss/app.scss';
import './scss/site.css';
import 'babel-core/polyfill';


import React from 'react';
import Main from './components/main.jsx';

import SFData from './service/sfdata.js6';
SFData.host = _sfdccreds.host;
SFData.access_token = _sfdccreds.session_api;

React.render(
  <Main />,
  document.getElementById('app')
);
