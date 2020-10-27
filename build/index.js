'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var raf = require('raf');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var raf__default = /*#__PURE__*/_interopDefaultLegacy(raf);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var AnimatedNumbersReact = function (props) {
    var initialValue = props.initialValue, style = props.style, value = props.value, duration = props.duration, stepPrecision = props.stepPrecision, component = props.component, formatValue = props.formatValue, frameStyle = props.frameStyle;
    var _a = React.useState(initialValue), currentValue = _a[0], setCurrentValue = _a[1];
    var _b = React.useState(initialValue), fromValue = _b[0], setFromValue = _b[1];
    var _c = React.useState(0), startTime = _c[0], setStartTime = _c[1];
    var _d = React.useState(0), currentTime = _d[0], setCurrentTime = _d[1];
    var _e = React.useState(), tweenHandle = _e[0], setTweenHandle = _e[1];
    React.useEffect(function () {
        prepareTween();
        return function () { return endTween(); };
    });
    var prepareTween = function () {
        setTweenHandle(raf__default['default'](function (timestamp) {
            tweenValue(timestamp, true);
        }));
    };
    var endTween = function () {
        raf__default['default'].cancel(tweenHandle);
        setCurrentValue(value);
    };
    var ensureSixtyFps = function (timestamp) {
        return !currentTime || timestamp - currentTime > 16;
    };
    var tweenValue = function (timestamp, start) {
        // @ts-ignore
        if (!ensureSixtyFps(timestamp))
            return setTweenHandle(raf__default['default'](tweenValue));
        var nCurrentTime = timestamp;
        var nStartTime = start ? timestamp : startTime;
        var nFromValue = start ? currentValue : fromValue;
        var newValue;
        if (nCurrentTime - nStartTime >= duration) {
            newValue = value;
        }
        else {
            newValue =
                nFromValue +
                    (value - nFromValue) * ((nCurrentTime - nStartTime) / duration);
        }
        if (newValue === value)
            return endTween();
        setCurrentValue(newValue);
        setStartTime(nStartTime ? nStartTime : nCurrentTime);
        setFromValue(nFromValue);
        setCurrentTime(nCurrentTime);
        // @ts-ignore
        setTweenHandle(raf__default['default'](tweenValue));
    };
    var adjustedValue = currentValue;
    var direction = value - fromValue;
    if (currentValue !== value) {
        if (stepPrecision > 0) {
            adjustedValue = Number(currentValue.toFixed(stepPrecision));
        }
        else if (direction < 0 && stepPrecision === 0) {
            adjustedValue = Math.floor(currentValue);
        }
        else if (direction > 0 && stepPrecision === 0) {
            adjustedValue = Math.ceil(currentValue);
        }
    }
    var perc = Math.abs(((adjustedValue - fromValue) / (value - fromValue)) * 100);
    var currStyle = frameStyle ? frameStyle(perc) : {};
    var nStyle = {};
    if (style && currStyle) {
        nStyle = __assign(__assign({}, style), currStyle);
    }
    else if (currStyle) {
        nStyle = currStyle;
    }
    return React.createElement(component, __assign(__assign({}, props), { style: nStyle }), formatValue ? formatValue(adjustedValue) : adjustedValue);
};

exports.default = AnimatedNumbersReact;
//# sourceMappingURL=index.js.map
