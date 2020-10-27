import * as React from "react";
import raf from "raf";

export type Props = {
  component: any;
  formatValue?: (n: number) => string;
  value: number;
  initialValue: number;
  duration: number;
  frameStyle?: (perc: number) => Object;
  stepPrecision: number;
  style?: React.CSSProperties;
  className?: string;
};

const AnimatedNumbersReact: React.FC<Props> = (props) => {
  const {
    initialValue,
    style,
    value,
    duration,
    stepPrecision,
    component,
    formatValue,
    frameStyle,
  } = props;

  const [currentValue, setCurrentValue] = React.useState(initialValue);
  const [fromValue, setFromValue] = React.useState(initialValue);
  const [startTime, setStartTime] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [tweenHandle, setTweenHandle] = React.useState();

  React.useEffect(() => {
    prepareTween();

    return () => endTween();
  });

  const prepareTween = () => {
    setTweenHandle(
      raf((timestamp: number) => {
        tweenValue(timestamp, true);
      })
    );
  };

  const endTween = () => {
    raf.cancel(tweenHandle);

    setCurrentValue(value);
  };

  const ensureSixtyFps = (timestamp: number) => {
    return !currentTime || timestamp - currentTime > 16;
  };

  const tweenValue = (timestamp: number, start: any) => {
    if (!ensureSixtyFps(timestamp)) return setTweenHandle(raf(tweenValue));

    const nCurrentTime = timestamp;
    const nStartTime = start ? timestamp : startTime;
    const nFromValue = start ? currentValue : fromValue;
    let newValue;

    if (nCurrentTime - nStartTime >= duration) {
      newValue = value;
    } else {
      newValue =
        nFromValue +
        (value - nFromValue) * ((nCurrentTime - nStartTime) / duration);
    }

    if (newValue === value) return endTween();

    setCurrentValue(newValue);
    setStartTime(nStartTime ? nStartTime : nCurrentTime)
    setFromValue(nFromValue);
    setCurrentTime(nCurrentTime);
    
    setTweenHandle(raf(tweenValue));
  };

  let adjustedValue: number = currentValue;
  const direction = value - fromValue;

  if (currentValue !== value) {
    if (stepPrecision > 0) {
      adjustedValue = Number(currentValue.toFixed(stepPrecision));
    } else if (direction < 0 && stepPrecision === 0) {
      adjustedValue = Math.floor(currentValue);
    } else if (direction > 0 && stepPrecision === 0) {
      adjustedValue = Math.ceil(currentValue);
    }
  }

  const perc = Math.abs(
    ((adjustedValue - fromValue) / (value - fromValue)) * 100
  );

  const currStyle: Object = frameStyle ? frameStyle(perc) : {};

  let nStyle = {};

  if (style && currStyle) {
    nStyle = {
      ...style,
      ...currStyle,
    };
  } else if (currStyle) {
    nStyle = currStyle;
  }

  return React.createElement(
    component,
    { ...props, style: nStyle },
    formatValue ? formatValue(adjustedValue) : adjustedValue
  );
};

export default AnimatedNumbersReact;
