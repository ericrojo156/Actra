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
export const projectDefaultColor = {
  red: 29,
  green: 158,
  blue: 255,
  alpha: 1,
  lightenValue: 30,
};
export const activityDefaultColor = {
  red: 255,
  green: 100,
  blue: 0,
  alpha: 1,
  lightenValue: 25,
};
export const projectDefaultColor_RGBSerialized = 'rgba(29, 158, 255, 0.85)';
export const activityDefaultColor_RGBSerialized = 'rgba(255, 100, 0, 1)';
export const PieChart = {
  nextColor: (index: any) => `color${1 + ((index + 1) % 8)}`,
  color1: {red: 66, green: 135, blue: 245},
  color2: {red: 245, green: 96, blue: 66},
  color3: {red: 90, green: 214, blue: 45},
  color4: {red: 144, green: 45, blue: 214},
  color5: {red: 214, green: 45, blue: 138},
  color6: {red: 45, green: 155, blue: 214},
  color7: {red: 166, green: 214, blue: 45},
  color8: {red: 214, green: 70, blue: 45},
  color9: {red: 45, green: 62, blue: 214},
};
