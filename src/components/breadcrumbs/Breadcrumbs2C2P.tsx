import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { breadcrumbsState } from '../../hooks/useBreadcrumbs';
import { useRecoilValue } from 'recoil';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  'breadcrumbs-2c2p': {
    color: '#3f51b5',
    textTransform: 'uppercase',
    fontWeight: 500,
    textDecoration: 'none',
  },
  'breadcrumbs-2c2p--active': {
    color: 'grey',
    textTransform: 'uppercase',
    fontWeight: 500,
    textDecoration: 'none',
  },
});

const Breadcrumbs2C2P = () => {
  const breadcrumbs = useRecoilValue(breadcrumbsState);
  const location = useLocation();
  const classes = useStyles();

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadcrumbs.map(breadcrumb => {
        return location.pathname !== breadcrumb.link ? (
          <Link
            className={classes['breadcrumbs-2c2p']}
            key={breadcrumb.link}
            to={breadcrumb.link}
          >
            {breadcrumb.name}
          </Link>
        ) : (
          <Box
            className={classes['breadcrumbs-2c2p--active']}
            key={breadcrumb.link}
            color="grey"
          >
            {breadcrumb.name}
          </Box>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumbs2C2P;
