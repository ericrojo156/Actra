import {Color} from './ColorPalette';

export function saturatingAddition(
  value: number,
  increment: number,
  max: number,
) {
  if (value === null || typeof value === 'undefined' || Number.isNaN(value)) {
    return max;
  } else if (max < value + increment) {
    return max;
  } else {
    return value + increment;
  }
}

export function computeGradientColor(color: Color): string {
  let lightenValue =
    Number.isInteger(color.lightenValue) &&
    color.lightenValue > 0 &&
    color.lightenValue <= 255
      ? color.lightenValue
      : 0;
  return `rgba(${saturatingAddition(
    color.red,
    lightenValue,
    255,
  )}, ${saturatingAddition(
    color.green,
    lightenValue,
    255,
  )}, ${saturatingAddition(color.blue, lightenValue, 255)}, 1)`;
}
