export interface IRoute {
  path: string;
  defaultPath?: string;
  name: string;
  component: FunctionComponent;
  exact?: boolean;
  routes?: IRoute[];
  type?: string[];
}
