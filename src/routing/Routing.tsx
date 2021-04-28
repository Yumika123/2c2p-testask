import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithRef,
} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IRoute } from '../types/route';

type TFormComponent = ForwardRefExoticComponent<PropsWithRef<IRoutingProps>>;

interface IRoutingProps {
  routes: IRoute[];
  path?: string;
  defaultRoute?: string;
  ref?: ForwardedRef<HTMLElement>;
  [key: string]: any;
}

const Routing = forwardRef(({ routes, path, defaultRoute, ...rest }, ref) => {
  const isDefaultRouteAvailable =
    path &&
    defaultRoute &&
    routes.findIndex((route: IRoute) => route.path === defaultRoute) !== -1;

  return (
    <Switch>
      {routes.map((route, i) => {
        return (
          <Route key={route.path} path={route.path} exact={route.exact}>
            <route.component
              name={route.name}
              path={route.path}
              routes={route.routes}
              defaultPath={route.defaultPath}
              ref={ref}
              {...rest}
            />
          </Route>
        );
      })}

      {isDefaultRouteAvailable ? (
        <Redirect from={path} to={defaultRoute} />
      ) : null}
    </Switch>
  );
}) as TFormComponent;

export default Routing;
