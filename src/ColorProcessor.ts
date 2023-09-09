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
    (color.lightenValue ?? 0) > 0 &&
    (color.lightenValue ?? 0) <= 255
      ? color.lightenValue
      : 0;
  return `rgba(${saturatingAddition(
    color.red,
    lightenValue ?? 0,
    255,
  )}, ${saturatingAddition(
    color.green,
    lightenValue ?? 0,
    255,
  )}, ${saturatingAddition(color.blue, lightenValue ?? 0, 255)}, 1)`;
}

export function serialize(color?: Color): string {
  if (!color) {
    return 'rgba(0, 0, 0, 0)';
  }
  return `rgba(${color.red}, ${color.green}, ${color.blue}, ${
    color.alpha ?? 1
  })`;
}
