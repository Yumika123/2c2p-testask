import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}

ReactDOM.render(React.createElement(App), document.getElementById('2c2p'));