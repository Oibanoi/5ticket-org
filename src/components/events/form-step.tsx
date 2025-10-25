import { PropsWithoutBag, ReactTag } from "types/element";
import React from "react";

type FormStepperProps = {
  children: React.ReactNode;
  step: number;
};

const FormStep = (props: FormStepperProps) => {
  const childrenArray = React.Children.toArray(props.children);
  const currentChild = childrenArray[props.step];
  return <>{currentChild}</>;
};

type StepProps = {
  children?: React.ReactNode;
};

const Step = <T extends ReactTag>({ as, ...props }: PropsWithoutBag<T>) => {
  const Element = (as || "div") as any;
  return <Element {...props} />;
};

FormStep.Step = Step;
export default FormStep;
