import React, { FunctionComponent, useEffect, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router-dom';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Box } from '@material-ui/core';

export interface IStep {
  title: string;
  href: string;
  key: string;
}

interface IStepperProps {
  steps: IStep[];
  onClickNext?: () => void;
  onClickPrev?: () => void;
  isNextDisabled?: boolean;
  children?: ReactJSXElement;
}

const Stepper2C2P: FunctionComponent<IStepperProps> = ({
  steps,
  onClickNext,
  onClickPrev,
  isNextDisabled,
  children,
}) => {
  const history = useHistory();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (steps.length && steps[currentStep])
      history.push(steps[currentStep].href);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, steps]);

  useEffect(() => {
    setCurrentStep(steps.findIndex(step => step.href === location.pathname));
  }, [location.pathname, steps]);

  const nextClickHandle = () => {
    onClickNext && onClickNext();
    setCurrentStep(currentStep + 1);
  };

  const prevClickHandle = () => {
    onClickPrev && onClickPrev();
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Stepper activeStep={currentStep} style={{ padding: '1rem 0rem' }}>
        {steps.map(step => (
          <Step key={step.key}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {children}
      <Box style={{ padding: '1rem 0rem' }}>
        <Button disabled={currentStep === 0} onClick={prevClickHandle}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={nextClickHandle}
          disabled={isNextDisabled}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </>
  );
};

export default Stepper2C2P;
