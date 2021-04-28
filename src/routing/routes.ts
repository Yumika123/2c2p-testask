import Billing from '../components/steps/Billing';
import Contact from '../components/steps/Contact';
import GeneralInfo from '../components/steps/GeneralInfo';
import BankList from '../pages/BankList';
import Creation from '../pages/Creation';
import Editing from '../pages/Editing';
import { IRoute } from '../types/route';

export const routes: IRoute[] = [
  {
    path: '/',
    name: 'Bank List',
    component: BankList,
    exact: true,
  },
  {
    path: '/create',
    defaultPath: '/create/general-info',
    name: 'Create a new bank',
    component: Creation,
    routes: [
      {
        path: '/create/general-info',
        name: 'General info',
        component: GeneralInfo,
        exact: true,
      },
      {
        path: '/create/contact',
        name: 'Contact',
        component: Contact,
        exact: true,
      },
      {
        path: '/create/billing',
        name: 'Billing',
        component: Billing,
        exact: true,
      },
    ],
  },
  {
    path: '/edit/:bankcode',
    defaultPath: '/edit/:bankcode/general-info',
    name: 'Edit a new bank',
    component: Editing,
    routes: [
      {
        path: '/edit/:bankcode/general-info',
        name: 'General info',
        component: GeneralInfo,
        exact: true,
      },
      {
        path: '/edit/:bankcode/contact',
        name: 'Contact',
        component: Contact,
        exact: true,
      },
      {
        path: '/edit/:bankcode/billing',
        name: 'Billing',
        component: Billing,
        exact: true,
      },
    ],
  },
];
