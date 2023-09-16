import React from 'react';
import {View} from 'react-native';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import {StyleSheet, Text} from 'react-native';
import {commonStyles} from '../commonStyles';
import {
  STANDARD_ELEMENT_WIDTH,
  ELEMENT_HEIGHT,
  PADDING_BETWEEN_ELEMENTS,
} from '../constants';
import CustomPressable from '../components/Pressable';
import {useIntervals} from './useIntervals';
import {useTimeString} from '../time/useTimeString';
import {useGetActivity} from '../activity/useActivities';

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

export interface TimeDisplayProps {
  seconds: number;
}

export function TimeDisplay(props: TimeDisplayProps) {
  const {seconds} = props;
  const {toTimeString} = useTimeString();
  const timeDisplayString = toTimeString(seconds);
  return <Text style={styles.textStyle}>{timeDisplayString}</Text>;
}

function IntervalElement(props: IntervalElementProps) {
  const {intervalId, parentActivityId, width} = props;
  const {getActivity} = useGetActivity();
  const {getInterval} = useIntervals(parentActivityId);

  const activity = getActivity(parentActivityId) ?? {
    color: ColorPalette.activityDefaultColor,
  };

  const interval = getInterval(intervalId) ?? {
    startTimeEpochSeconds: 0,
    endTimeEpochSeconds: 0,
  };

  const intervalStyle = {
    ...commonStyles.roundedElementBorder,
    ...styles.intervalElement,
    width: width ?? STANDARD_ELEMENT_WIDTH,
    backgroundColor: ColorProcessor.serialize(activity.color),
  };

  return (
    <View style={{paddingTop: PADDING_BETWEEN_ELEMENTS}}>
      <CustomPressable style={intervalStyle}>
        <Text style={styles.textStyle}>
          <TimeDisplay
            seconds={
              interval.endTimeEpochSeconds - interval.startTimeEpochSeconds
            }
          />
        </Text>
        <Text style={styles.textStyle}>{'---->'}</Text>
      </CustomPressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  intervalElement: {
    width: STANDARD_ELEMENT_WIDTH,
    minHeight: ELEMENT_HEIGHT,
  },
  textStyle: {
    textAlign: 'center',
    color: ColorPalette.OffWhite_RGBSerialized,
    fontSize: 20,
  },
});

export default React.memo(IntervalElement);
