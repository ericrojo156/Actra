import React, {useCallback, useMemo} from 'react';
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
import {useGetActivity} from '../activity/useActivities';
import RightArrow from '../../assets/RightArrow';
import {IdType} from '../types';
import {useIntervalRealTimeDuration} from '../time/useRealTimeIntervalDuration';
import {TimeDisplay, DateTimeDisplay} from '../time/TimeDisplay';
import {useNavigation} from '@react-navigation/native';
import {ActivityIntervalRelation, Interval} from './types';

export interface IntervalElementProps extends ActivityIntervalRelation {
  width?: number;
  setCurrentlyPressingId?: (id: IdType) => void;
}
function IntervalElement(props: IntervalElementProps) {
  const {intervalId, parentActivityId, width, setCurrentlyPressingId} = props;
  const {getActivity} = useGetActivity();
  const {getInterval} = useIntervals(parentActivityId);
  const activity = getActivity(parentActivityId) ?? {
    color: ColorPalette.activityDefaultColor,
  };
  const interval: Interval | null = getInterval(intervalId);
  const durationMilliseconds = useIntervalRealTimeDuration(interval);
  const intervalStyle = {
    ...commonStyles.container,
    ...commonStyles.roundedElementBorder,
    ...styles.intervalElement,
    width: width ?? STANDARD_ELEMENT_WIDTH,
    backgroundColor: ColorProcessor.serialize(activity.color),
  };
  const navigation = useNavigation();
  const goToEditInterval = useCallback(
    (intervalId: IdType): void => {
      // @ts-ignore
      navigation.navigate('EditInterval', {interval: getInterval(intervalId)});
    },
    [getInterval, navigation],
  );
  const pressableTrackingCallbacks = useMemo(
    () => ({
      onPress: () => goToEditInterval(intervalId),
      onPressIn: () => setCurrentlyPressingId?.(intervalId),
      onPressOut: () => setCurrentlyPressingId?.(null),
    }),
    [intervalId, goToEditInterval, setCurrentlyPressingId],
  );

  if (interval === null) {
    return null;
  }

  return (
    <View style={{paddingTop: PADDING_BETWEEN_ELEMENTS}}>
      <CustomPressable {...pressableTrackingCallbacks} style={intervalStyle}>
        <Text style={styles.textStyle}>
          <TimeDisplay milliseconds={durationMilliseconds} />
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
