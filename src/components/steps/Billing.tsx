import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import _isEmpty from 'lodash.isempty';
import { ILocalBank } from '../../types/localbank';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { Box, Typography } from '@material-ui/core';

type TFormComponent = ForwardRefExoticComponent<PropsWithRef<IBillingProps>>;

interface IBillingProps {
  currentBank: ILocalBank;
  onStepSubmit: (data) => void;
  setNextDisabled: (data) => void;
  ref?: ForwardedRef<any>;
}

const Billing = forwardRef(
  (
    { currentBank: bankData, setNextDisabled, onStepSubmit }: IBillingProps,
    ref
  ) => {
    useBreadcrumbs('Billing');
    const {
      handleSubmit,
      control,
      setValue,
      formState: { errors, isDirty },
      watch,
    } = useForm({
      mode: 'onChange',
    });

    const [billingEmailCheckbox, setBillingEmailCheckbox] = useState<boolean>(
      false
    );

    const startDate = watch('startDate');
    const billingEmail = watch('billingEmail');

    const defaultPeriod = useMemo(() => {
      if (!bankData?.cardSchemes) return;

      if (bankData?.period) return bankData?.period.toString();
      if (
        bankData?.cardSchemes.includes(1) &&
        !bankData?.cardSchemes.includes(2)
      )
        return '1';
      if (bankData?.cardSchemes.includes(2)) return '2';
      return '0';
    }, [bankData]);

    useEffect(() => {
      if (
        bankData &&
        bankData.email === bankData.billingEmail &&
        bankData.billingEmail
      ) {
        setBillingEmailCheckbox(true);
      }
    }, [bankData]);

    useEffect(() => {
      setNextDisabled(
        (!isDirty && !bankData?.startDate) ||
          !_isEmpty(errors) ||
          !startDate ||
          !billingEmail
      );
    }, [
      bankData?.startDate,
      errors,
      isDirty,
      startDate,
      setNextDisabled,
      billingEmail,
    ]);

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
            name="startDate"
            control={control}
            rules={{ required: true }}
            defaultValue={bankData?.startDate}
            render={({ field }) => (
              <TextField
                error={errors.startDate}
                label="Start Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                margin="dense"
                {...field}
              />
            )}
          />

          {bankData?.cardSchemes && (
            <Controller
              control={control}
              name="period"
              defaultValue={defaultPeriod}
              render={({ field }) => (
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography style={{ marginRight: '1rem' }} variant="body2">
                    Period:
                  </Typography>
                  <RadioGroup row value={field.value} onChange={field.onChange}>
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Monthly"
                      disabled={
                        bankData?.cardSchemes.includes(1) ||
                        bankData?.cardSchemes.includes(2)
                      }
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Quaterly"
                      disabled={bankData?.cardSchemes.includes(2)}
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Annually"
                    />
                  </RadioGroup>
                </Box>
              )}
            />
          )}

          <Controller
            name="billingEmail"
            control={control}
            rules={{
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            }}
            defaultValue={bankData?.billingEmail || ''}
            render={({ field }) => (
              <TextField
                error={errors.billingEmail}
                variant="outlined"
                label="Billing Email"
                disabled={billingEmailCheckbox}
                margin="dense"
                {...field}
              />
            )}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={billingEmailCheckbox}
                onChange={event => {
                  setBillingEmailCheckbox(event.target.checked);
                  event.target.checked
                    ? setValue('billingEmail', bankData?.email, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    : setValue('billingEmail', '', {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                }}
                name="asContactEmailCheckbox"
              />
            }
            label="Same as contact email"
          />
        </Grid>
      </form>
    );
  }
) as TFormComponent;

export default Billing;
