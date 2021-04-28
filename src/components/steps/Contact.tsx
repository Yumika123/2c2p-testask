import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { useRecoilValue } from 'recoil';
import PhoneInput from 'material-ui-phone-number';
import { currentCountryState } from '../../state/countrylist';
import { ILocalBank } from '../../types/localbank';
import { Box, Typography } from '@material-ui/core';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';

type TFormComponent = ForwardRefExoticComponent<PropsWithRef<IContactProps>>;

interface IContactProps {
  currentBank: ILocalBank;
  setNextDisabled: (data) => void;
  onStepSubmit: (data) => void;
  ref?: ForwardedRef<any>;
}

const Contact = forwardRef(
  (
    { currentBank: bankData, setNextDisabled, onStepSubmit }: IContactProps,
    ref
  ) => {
    useBreadcrumbs('Contact');

    const {
      handleSubmit,
      control,
      formState: { errors, dirtyFields, isDirty },
      getValues,
    } = useForm({
      mode: 'onChange',
    });

    const currentCountry = useRecoilValue(currentCountryState);

    useEffect(() => {
      setNextDisabled(
        (!isDirty && !bankData?.name) ||
          errors.name ||
          (!dirtyFields.name && !getValues('name')) ||
          errors.email ||
          (!dirtyFields.email && !getValues('email'))
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors.email, errors.name, isDirty, bankData]);

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onStepSubmit)();
      },
    }));

    return (
      <form noValidate autoComplete="off">
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            defaultValue={bankData?.name || ''}
            render={({ field }) => (
              <TextField
                error={errors.name}
                variant="outlined"
                label="Contact Name"
                margin="dense"
                {...field}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            }}
            defaultValue={bankData?.email || ''}
            render={({ field }) => (
              <TextField
                error={errors.email}
                variant="outlined"
                label="Contact Email"
                margin="dense"
                {...field}
              />
            )}
          />
          <Controller
            name="mobile"
            control={control}
            rules={{
              minLength: 10,
            }}
            defaultValue={bankData?.mobile || ''}
            render={({ field }) => (
              <PhoneInput
                variant="outlined"
                label="Contact Phone"
                defaultCountry={currentCountry?.alpha2Code || ''}
                disableAreaCodes
                margin="dense"
                {...field}
              />
            )}
          />

          <Controller
            rules={{ required: true }}
            control={control}
            name="preferredMethod"
            defaultValue={bankData?.preferredMethod || '0'}
            render={({ field }) => (
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Preffered method: </Typography>
                <RadioGroup
                  row
                  value={
                    !dirtyFields.mobile || errors.mobile ? '0' : field.value
                  }
                  onChange={field.onChange}
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="Email"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Phone"
                    labelPlacement="start"
                    disabled={!dirtyFields.mobile || errors.mobile}
                  />
                </RadioGroup>
              </Box>
            )}
          />
        </Grid>
      </form>
    );
  }
) as TFormComponent;

export default Contact;
