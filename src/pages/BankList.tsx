import React, { useEffect, useMemo } from 'react';
import {
  bankListFilters,
  bankListState,
  bankListStatus,
  useClearBank,
  useLoadBankList,
  useUpdateFilters,
} from '../state/banklist';
import { useRecoilValue } from 'recoil';
import Table from '../components/table/Table2C2P';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import _isEmpty from 'lodash.isempty';
import EditIcon from '@material-ui/icons/Edit';
import { Status } from '../state/status';
import { CircularProgress } from '@material-ui/core';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const BankList = () => {
  const loadBankList = useLoadBankList();
  const updateFilters = useUpdateFilters();
  const clearBanks = useClearBank();
  const { banks } = useRecoilValue(bankListState) || {};
  const { status, error } = useRecoilValue(bankListStatus);
  const filters = useRecoilValue(bankListFilters);
  const history = useHistory();

  const localCount = 7;
  const pageSize = 5;
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const [openSuccessNotifications, setOpenSuccessNotification] = React.useState(
    false
  );
  const [openErrorNotifications, setOpenErrorNotification] = React.useState(
    false
  );

  useEffect(() => {
    if (status === Status.SUCCESS) {
      setOpenSuccessNotification(true);
    }
    if (status === Status.ERROR) {
      setOpenErrorNotification(true);
    }
  }, [status]);

  useEffect(() => {
    clearBanks();
    loadBankList({ page: 1 });
    return () => {
      updateFilters({ page: 1 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !_isEmpty(filters) && loadBankList(filters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessNotification(false);
    setOpenErrorNotification(false);
  };

  const data = useMemo(() => {
    if (!banks) return [];

    return banks.map(bank => {
      return {
        bankCode: { content: bank.bankCode },
        bankName: { content: bank.bankName },
        modifiedDate: { content: bank.modifiedDate || bank.createdDate },
        edit: {
          renderCell: () => (
            <Link to={`/edit/${bank.bankCode}/general-info`}>
              <EditIcon fontSize="small" color="primary" />
            </Link>
          ),
        },
      };
    });
  }, [banks]);

  const handlePageChange = (event, page) => {
    if (page === currentPage) {
      return;
    }

    setCurrentPage(page);

    updateFilters({
      page: page + 1,
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Bank Code',
        accessor: 'bankCode',
      },
      {
        Header: 'Bank Name',
        accessor: 'bankName',
      },
      {
        Header: 'Last Updated',
        accessor: 'modifiedDate',
      },
      {
        Header: 'More',
        accessor: 'edit',
      },
    ],
    []
  );

  return (
    <Container disableGutters>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push('/create/general-info')}
        >
          Create Bank
        </Button>
      </Box>

      {status === Status.LOADING || status === Status.INITIAL ? (
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table
          rows={data}
          head={columns}
          hasPagination
          currentPage={currentPage}
          handleChangePage={handlePageChange}
          count={localCount}
          pageSize={pageSize}
        ></Table>
      )}

      <Snackbar
        open={openErrorNotifications}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {error?.errorDescription || 'An error has occurred'}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccessNotifications}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          The operation was success
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BankList;
