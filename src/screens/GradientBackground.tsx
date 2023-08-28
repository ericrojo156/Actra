import React, {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';
import * as ColorPalette from '../ColorPalette';
import {computeGradientColor} from '../ColorProcessor';
import LinearGradient from 'react-native-linear-gradient';

interface GradientBackgroundProps {
  invert?: boolean;
  horizontal?: boolean;
}

export default function GradientBackground(
  props: PropsWithChildren<GradientBackgroundProps>,
) {
  const {children, invert, horizontal} = props;
  let horizontalStartToEnd = {};
  let colors = [
    computeGradientColor(ColorPalette.SoftBlack),
    ColorPalette.SoftBlack_RGBASerialized,
    ColorPalette.SoftBlack_RGBASerialized,
  ];
  if (invert) {
    colors = colors.reverse();
  }
  if (horizontal) {
    horizontalStartToEnd = {start: {x: 0, y: 0}, end: {x: 1, y: 0}};
  }
  return (
    <LinearGradient
      {...horizontalStartToEnd}
      colors={colors}
      style={[styles.backgroundContainer]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    height: '100%',
  },
});
