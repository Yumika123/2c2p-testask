import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IRoute } from '../types/route';
import Stepper from '../components/stepper/Stepper2C2P';
import Routing from '../routing/Routing';
import { countryListState, useSetCurrentCountry } from '../state/countrylist';
import { useRecoilValue } from 'recoil';
import { ILocalBank } from '../types/localbank';
import { bankListStatus, useCreateBank } from '../state/banklist';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs2C2P';
import useBreadcrumbs from '../hooks/useBreadcrumbs';
import { Status } from '../state/status';
import { Box } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

interface ICreationProps {
  name: string;
  path: string;
  defaultPath?: string;
  routes: IRoute[];
}

function routeToSteps(route: IRoute) {
  return {
    title: route.name,
    href: route.path,
    key: route.path,
  };
}

const Creation: FunctionComponent<ICreationProps> = ({
  name,
  path,
  routes,
  defaultPath,
}) => {
  useBreadcrumbs(name);

  const history = useHistory();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { countries } = useRecoilValue(countryListState);
  const { status, error } = useRecoilValue(bankListStatus);
  const [localBank, setLocalBank] = useState<ILocalBank>();
  const setCurrentCountry = useSetCurrentCountry();
  const createBank = useCreateBank();
  const steps = useMemo(() => {
    return routes.map(route => routeToSteps(route));
  }, [routes]);
  const [open, setOpen] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    if (status === Status.SUCCESS) {
      history.push('/');
    }
    if (status === Status.ERROR) setOpen(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (localBank && localBank.billingEmail) {
      createBank(localBank);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localBank]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const nextClickHandle = () => {
    formRef?.current?.submit();
  };

  const onStepSubmit = (value: ILocalBank) => {
    value?.country &&
      setCurrentCountry(
        countries.find(country => country.id === value.country)
      );
    setLocalBank({ ...localBank, ...value });
  };

  return (
    <>
      {status === Status.CREATING && (
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error?.errorDescription || 'An error has occurred'}
        </Alert>
      </Snackbar>
      <Breadcrumbs />
      <Stepper
        steps={steps}
        onClickNext={nextClickHandle}
        isNextDisabled={isDisabled}
      >
        <Routing
          routes={routes}
          path={path}
          defaultRoute={
            routes.some(route => route.path === defaultPath)
              ? defaultPath
              : routes[0]?.path
          }
          onStepSubmit={onStepSubmit}
          setNextDisabled={setIsDisabled}
          currentBank={localBank}
          ref={formRef}
        />
      </Stepper>
    </>
  );
};

export default Creation;
