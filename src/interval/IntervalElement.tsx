import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import {StyleSheet} from 'react-native';
import {commonStyles} from '../commonStyles';
import {
  STANDARD_ELEMENT_WIDTH,
  STANDARD_ELEMENT_HEIGHT,
  PADDING_BETWEEN_ELEMENTS,
} from '../constants';
import CustomPressable from '../components/Pressable';
import {useIntervals} from './useIntervals';
import {useGetActivity} from '../activity/useActivities';
import {IdType} from '../types';
import {useNavigation} from '@react-navigation/native';
import {ActivityIntervalRelation, Interval} from './types';
import {TimeSpanElement} from '../time/TimeSpanElement';
import {useRealTimeDuration} from '../time/useRealTimeDuration';
import {TimeDisplay} from '../time/TimeDisplay';

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
  const intervalStyle = {
    ...commonStyles.container,
    ...commonStyles.roundedElementBorder,
    ...styles.intervalElement,
    width: width ?? STANDARD_ELEMENT_WIDTH,
    backgroundColor: ColorProcessor.serialize(activity.color),
  };
  const navigation = useNavigation();
  const goToEditInterval = useCallback((): void => {
    if (interval === null) {
      return;
    }
    // @ts-ignore
    navigation.navigate('EditInterval', {interval});
  }, [interval, navigation]);
  const pressableTrackingCallbacks = useMemo(
    () => ({
      onPress: () => goToEditInterval(),
      onPressIn: () => setCurrentlyPressingId?.(intervalId),
      onPressOut: () => setCurrentlyPressingId?.(null),
    }),
    [intervalId, goToEditInterval, setCurrentlyPressingId],
  );
  const durationMilliseconds = useRealTimeDuration(interval);

  if (interval === null) {
    return null;
  }

  return (
    <View style={{paddingTop: PADDING_BETWEEN_ELEMENTS}}>
      <CustomPressable {...pressableTrackingCallbacks} style={intervalStyle}>
        <Text style={styles.textStyle}>
          <TimeDisplay milliseconds={durationMilliseconds} />
        </Text>
        <TimeSpanElement timeSpan={interval} />
      </CustomPressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  intervalElement: {
    width: STANDARD_ELEMENT_WIDTH,
    minHeight: STANDARD_ELEMENT_HEIGHT,
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    color: ColorPalette.OffWhite_RGBSerialized,
    fontSize: 20,
  },
});

export default React.memo(IntervalElement);
