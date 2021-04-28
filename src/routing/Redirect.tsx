import React from 'react';
import { Redirect as ReactRouterRedirect, Route } from 'react-router-dom';

const Redirect = props => {
  const { from, to, ...rest } = props;

  if (!from) {
    return <ReactRouterRedirect {...props} />;
  }

  return (
    <Route
      path={from}
      render={({ match }) => {
        const paramKeys = Object.keys(match.params);

        const toWithReplacedParamsKeys = paramKeys.reduce(
          (url, key) => url.replace(`:${key}`, match.params[key]),
          to
        );

        return <ReactRouterRedirect to={toWithReplacedParamsKeys} {...rest} />;
      }}
    />
  );
};

export default Redirect;
