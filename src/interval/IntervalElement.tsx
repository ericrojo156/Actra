import React, {useMemo} from 'react';
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
import {useIntervals} from './useIntervals';
import {useTimeString} from '../time/useTimeString';

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
  seconds: number;
}

export function TimeDisplay(props: TimeDisplayProps) {
  const {seconds} = props;
  const {toTimeString} = useTimeString();
  const timeDisplayString = useMemo(
    () => toTimeString(seconds),
    [seconds, toTimeString],
  );
  return <Text style={styles.textStyle}>{timeDisplayString}</Text>;
}

export function IntervalElement(props: IntervalElementProps) {
  const {intervalId, parentActivityId, width} = props;
  let intervalStyle: StyleProp<ViewStyle> = {
    ...commonStyles.container,
    ...commonStyles.roundedElementBorder,
    ...styles.intervalElement,
    width: width ?? STANDARD_ELEMENT_WIDTH,
  };
  const {getActivity} = useActivities();
  const {getInterval} = useIntervals(parentActivityId);
  const {startTimeEpochSeconds, endTimeEpochSeconds} = useMemo(
    () =>
      getInterval(intervalId) ?? {
        startTimeEpochSeconds: 0,
        endTimeEpochSeconds: 0,
      },
    [getInterval, intervalId],
  );
  const {color} = useMemo(
    () =>
      getActivity(parentActivityId) ?? {
        color: ColorPalette.activityDefaultColor,
      },
    [getActivity, parentActivityId],
  );
  if (color) {
    intervalStyle = {
      ...intervalStyle,
      backgroundColor: ColorProcessor.serialize(color),
    };
  }
  const durationSeconds = endTimeEpochSeconds - startTimeEpochSeconds;
  return (
    <CustomPressable style={intervalStyle}>
      <Text style={styles.textStyle}>
        <TimeDisplay seconds={durationSeconds} />
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
    textAlign: 'center',
    color: ColorPalette.OffWhite_RGBSerialized,
    fontSize: 20,
  },
});
