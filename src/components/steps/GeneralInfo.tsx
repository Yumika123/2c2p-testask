import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { Controller, useForm } from 'react-hook-form';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { countryListState, useLoadCountryList } from '../../state/countrylist';
import { useRecoilValue } from 'recoil';
import { schemeListState, useLoadSchemeList } from '../../state/schemelist';
import { ILocalBank } from '../../types/localbank';
import { makeStyles } from '@material-ui/styles';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';

type TFormComponent = ForwardRefExoticComponent<
  PropsWithRef<IGeneralInfoProps>
>;

interface IGeneralInfoProps {
  currentBank: ILocalBank;
  setNextDisabled: (data) => void;
  onStepSubmit: (data) => void;
  mode: 'editing' | 'creation';
  ref?: ForwardedRef<any>;
}

const useStyles = makeStyles({
  'MuiFormControl-root': {
    marginTop: '0.5rem !important',
    marginBottom: '0.8rem !important',
  },
});

const GeneralInfo = forwardRef(
  (
    {
      currentBank: bankData,
      setNextDisabled,
      onStepSubmit,
      mode,
    }: IGeneralInfoProps,
    ref
  ) => {
    useBreadcrumbs('General Info');
    const classes = useStyles();

    const {
      handleSubmit,
      control,
      formState: { errors, isDirty, isValid },
    } = useForm({
      mode: 'onChange',
    });

    const loadCountryList = useLoadCountryList();
    const loadSchemeList = useLoadSchemeList();
    const { countries } = useRecoilValue(countryListState) || {};
    const { cardSchemes: schemes } = useRecoilValue(schemeListState) || {};

    useEffect(() => {
      loadCountryList();
      loadSchemeList();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      setNextDisabled((!isDirty && !bankData?.bankCode) || !isValid);
    }, [isDirty, isValid, bankData, setNextDisabled]);

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onStepSubmit)();
      },
    }));

    return (
      <form noValidate autoComplete="off" ref={ref}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Controller
            name="bankCode"
            control={control}
            rules={{ required: true }}
            defaultValue={bankData?.bankCode || ''}
            render={({ field }) => (
              <TextField
                error={errors.bankCode}
                variant="outlined"
                label="Bank Code"
                disabled={mode === 'editing'}
                margin="dense"
                {...field}
              />
            )}
          />
          <Controller
            name="bankName"
            control={control}
            rules={{ required: true }}
            defaultValue={bankData?.bankName || ''}
            render={({ field }) => (
              <TextField
                error={errors.bankName}
                variant="outlined"
                label="Bank Name"
                margin="dense"
                {...field}
              />
            )}
          />
          <Controller
            name="bankUrl"
            control={control}
            rules={{
              required: true,
              pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            }}
            defaultValue={bankData?.bankUrl || ''}
            render={({ field }) => (
              <TextField
                error={errors.bankUrl}
                variant="outlined"
                label="Bank URL"
                margin="dense"
                {...field}
              />
            )}
          />

          {!!countries?.length && (
            <FormControl
              variant="outlined"
              className={classes['MuiFormControl-root']}
            >
              <InputLabel margin="dense" id="general-info-country-label">
                Country
              </InputLabel>
              <Controller
                name="country"
                control={control}
                defaultValue={bankData?.country || ''}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    labelId="general-info-country-label"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.country}
                    margin="dense"
                  >
                    {countries.map(country => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          )}
          {!!schemes?.length && (
            <FormControl variant="outlined">
              <InputLabel margin="dense" id="general-info-schemes-label">
                Schemes
              </InputLabel>
              <Controller
                name="cardSchemes"
                control={control}
                defaultValue={bankData?.cardSchemes || []}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <Select
                      error={errors.cardSchemes}
                      labelId="general-info-schemes-label"
                      multiple
                      value={field.value}
                      onChange={field.onChange}
                      margin="dense"
                    >
                      {schemes.map(scheme => (
                        <MenuItem value={scheme.id}>{scheme.type}</MenuItem>
                      ))}
                    </Select>
                  );
                }}
              />
            </FormControl>
          )}
        </Grid>
      </form>
    );
  }
) as TFormComponent;

export default GeneralInfo;
