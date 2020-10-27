import * as React from "react";
export declare type Props = {
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
declare const AnimatedNumbersReact: React.FC<Props>;
export default AnimatedNumbersReact;
