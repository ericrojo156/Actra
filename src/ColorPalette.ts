import * as ColorProcessor from './ColorProcessor';
export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
  lightenValue?: number;
}

export const SoftBlack: Color = {
  red: 30,
  green: 30,
  blue: 30,
  alpha: 1,
  lightenValue: 20,
};
export const SoftBlack_RGBASerialized = `rgba(${SoftBlack.red}, ${SoftBlack.green}, ${SoftBlack.blue}, ${SoftBlack.alpha})`;
export const OffWhite = {red: 240, green: 240, blue: 240, alpha: 1};
export const OffWhite_RGBSerialized = `rgba(${OffWhite.red}, ${OffWhite.green}, ${OffWhite.blue}, ${OffWhite.alpha})`;
export const defaultTrackableColor = 'rgba(130, 130, 130, 1)';
export const infoMessage = 'rgba(66, 135, 245, 1)';
export const errorMessage = '#B00020';

export const activityDefaultColor = {
  red: 255,
  green: 100,
  blue: 0,
  alpha: 1,
  lightenValue: 25,
};
export const activityDefaultColor_RGBSerialized = 'rgba(255, 100, 0, 1)';

export const actionColor: Color = {
  red: 29,
  green: 158,
  blue: 255,
  alpha: 1,
  lightenValue: 30,
};

export const actionColorSerialized: string =
  ColorProcessor.serialize(actionColor);
