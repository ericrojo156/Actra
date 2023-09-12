import React from 'react';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import {StyleProp, ViewStyle, StyleSheet, Text} from 'react-native';
import {commonStyles} from '../commonStyles';
import {
  STANDARD_ELEMENT_WIDTH,
  ELEMENT_HEIGHT,
  SPACE_BETWEEN_ELEMENTS,
} from '../constants';
import useActivities from '../activity/useActivities';
import CustomPressable from '../components/Pressable';

export interface ActivityIntervalRelation {
  intervalId: string;
  parentActivityId: string;
}

export interface Interval extends ActivityIntervalRelation {
  startTimeEpochSeconds: number;
  endTimeEpochSeconds: number;
}

export interface IntervalElementProps extends ActivityIntervalRelation {
  width?: number;
}

export type TimeUnit = 'days' | 'hours' | 'mins' | 'seconds';

export interface TimeDisplayProps {
  units: TimeUnit[];
}

export function TimeDisplay(_props: TimeDisplayProps) {
  return <Text>60 mins</Text>;
}

export function IntervalElement(props: IntervalElementProps) {
  const {parentActivityId, width} = props;
  let intervalStyle: StyleProp<ViewStyle> = {
    ...commonStyles.container,
    ...commonStyles.roundedElementBorder,
    ...styles.intervalElement,
    width: width ?? STANDARD_ELEMENT_WIDTH,
  };
  const {getActivity} = useActivities();
  const {color} = getActivity(parentActivityId) ?? {
    color: ColorPalette.activityDefaultColor,
  };
  if (color) {
    intervalStyle = {
      ...intervalStyle,
      backgroundColor: ColorProcessor.serialize(color),
    };
  }
  return (
    <CustomPressable style={intervalStyle}>
      <Text style={styles.textStyle}>
        <TimeDisplay units={['mins']} />
      </Text>
      <Text style={styles.textStyle}>{'---->'}</Text>
    </CustomPressable>
  );
}

export const styles = StyleSheet.create({
  intervalElement: {
    gap: SPACE_BETWEEN_ELEMENTS,
    width: STANDARD_ELEMENT_WIDTH,
    minHeight: ELEMENT_HEIGHT,
  },
  textStyle: {
    color: ColorPalette.OffWhite_RGBSerialized,
    fontSize: 20,
  },
});
