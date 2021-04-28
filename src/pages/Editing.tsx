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
import {
  bankEntityState,
  bankListStatus,
  useLoadBank,
  useUpdateBank,
} from '../state/banklist';
import { useHistory, useParams } from 'react-router-dom';
import { ParamTypes } from '../types/paramtypes';
import useBreadcrumbs from '../hooks/useBreadcrumbs';
import Breadcrumbs from '../components/breadcrumbs/Breadcrumbs2C2P';
import _isEmpty from 'lodash.isempty';
import { Status } from '../state/status';
import { Box, Container } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import _isEqual from 'lodash.isequal';

interface IEditingProps {
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

const Editing: FunctionComponent<IEditingProps> = ({
  name,
  path,
  routes,
  defaultPath,
}) => {
  useBreadcrumbs(name);

  const history = useHistory();
  const { bankcode } = useParams<ParamTypes>();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [localBank, setLocalBank] = useState<ILocalBank>();
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const { countries } = useRecoilValue(countryListState);
  const { status } = useRecoilValue(bankListStatus);
  const setCurrentCountry = useSetCurrentCountry();
  const loadBank = useLoadBank();
  const updateBank = useUpdateBank();
  const steps = useMemo(() => {
    return routes.map(route => routeToSteps(route));
  }, [routes]);
  const bank = useRecoilValue(bankEntityState);

  const formRef = useRef(null);

  useEffect(() => {
    if (status === Status.SUCCESS || status === Status.ERROR) history.push('/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (bank) setLocalBank(bank);

    return () => {
      setLocalBank(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank]);

  useEffect(() => {
    if (bankcode && !bankcode.includes(':') && _isEmpty(localBank))
      loadBank(bankcode);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankcode]);

  useEffect(() => {
    if (!_isEqual(localBank, bank) && isFinish)
      updateBank(localBank?.bankCode || bankcode, localBank);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localBank, isFinish]);

  const nextClickHandle = () => {
    formRef?.current?.submit();
  };

  const onStepSubmit = (value: ILocalBank) => {
    value?.country &&
      setCurrentCountry(
        countries.find(country => country.id === value.country)
      );
    setLocalBank({ ...localBank, ...value });
    value && value.billingEmail && setIsFinish(true);
  };

  return (
    <Container disableGutters>
      {status === Status.UPDATING && (
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      <Breadcrumbs />
      {status === Status.LOADING || status === Status.INITIAL ? (
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stepper
          steps={steps}
          onClickNext={nextClickHandle}
          isNextDisabled={isDisabled}
        >
          {!_isEmpty(localBank) && (
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
              ref={formRef}
              currentBank={localBank}
              mode="editing"
            />
          )}
        </Stepper>
      )}
    </Container>
  );
};

export default Editing;
