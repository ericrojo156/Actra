import {StyleSheet} from 'react-native';
import * as ColorPalette from './ColorPalette';

export const commonStyles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textStyle: {
    color: ColorPalette.OffWhite_RGBSerialized,
  },
});