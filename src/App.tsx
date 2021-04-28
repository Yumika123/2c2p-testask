import React, { FunctionComponent } from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';
import Routing from './routing/Routing';
import { routes } from './routing/routes';

export const App: FunctionComponent = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routing routes={routes} />
      </Router>
    </RecoilRoot>
  );
};
