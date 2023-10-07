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
import RightArrow from '../../assets/RightArrow';
import {IdType} from '../types';
import {useTranslation} from '../internationalization/useTranslation';

export interface ActivityIntervalRelation {
  intervalId: IdType;
  parentActivityId: IdType;
}

export interface Interval extends ActivityIntervalRelation {
  startTimeEpochMilliseconds: number;
  endTimeEpochMilliseconds: number | null;
}

export interface IntervalElementProps extends ActivityIntervalRelation {
  width?: number;
}

export type TimeUnit = 'days' | 'hours' | 'mins' | 'seconds';

export interface MillisecondsProps {
  milliseconds: number | null;
}

export const TimeDisplay = React.memo(function (props: MillisecondsProps) {
  const {milliseconds} = props;
  const {toDurationString} = useTimeString();
  const {translate} = useTranslation();
  if (milliseconds === null) {
    return (
      <View>
        <Text style={{...styles.textStyle}}>{translate('Now')}</Text>
      </View>
    );
  }
  const timeDisplayString = toDurationString(milliseconds);
  return <Text style={styles.textStyle}>{timeDisplayString}</Text>;
});

export const DateTimeDisplay = React.memo(function (props: MillisecondsProps) {
  const {milliseconds} = props;
  const {toDateTimeString} = useTimeString();
  const {translate} = useTranslation();
  if (milliseconds === null) {
    return (
      <View>
        <Text style={{...styles.textStyle}}>{translate('Now')}</Text>
      </View>
    );
  }
  const {date, time} = toDateTimeString(milliseconds);
  return (
    <View>
      <Text style={{...styles.textStyle, fontSize: 15}}>{date}</Text>
      <Text style={{...styles.textStyle, fontSize: 15}}>{time}</Text>
    </View>
  );
});

function IntervalElement(props: IntervalElementProps) {
  const {intervalId, parentActivityId, width} = props;
  const {getActivity} = useGetActivity();
  const {getInterval} = useIntervals(parentActivityId);

  const activity = getActivity(parentActivityId) ?? {
    color: ColorPalette.activityDefaultColor,
  };

  const interval: Interval | null = getInterval(intervalId);

  const intervalStyle = {
    ...commonStyles.container,
    ...commonStyles.roundedElementBorder,
    ...styles.intervalElement,
    width: width ?? STANDARD_ELEMENT_WIDTH,
    backgroundColor: ColorProcessor.serialize(activity.color),
  };

  if (interval === null) {
    return null;
  }
  return (
    <View style={{paddingTop: PADDING_BETWEEN_ELEMENTS}}>
      <CustomPressable style={intervalStyle}>
        <Text style={styles.textStyle}>
          <TimeDisplay
            milliseconds={
              (interval.endTimeEpochMilliseconds ?? Date.now()) -
              interval.startTimeEpochMilliseconds
            }
          />
        </Text>
        <View style={{flexDirection: 'row'}}>
          <DateTimeDisplay milliseconds={interval.startTimeEpochMilliseconds} />
          <RightArrow />
          <DateTimeDisplay milliseconds={interval.endTimeEpochMilliseconds} />
        </View>
      </CustomPressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  intervalElement: {
    width: STANDARD_ELEMENT_WIDTH,
    minHeight: ELEMENT_HEIGHT,
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    color: ColorPalette.OffWhite_RGBSerialized,
    fontSize: 20,
  },
});

export default React.memo(IntervalElement);
