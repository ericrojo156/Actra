import React, {useMemo} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {TimeSpan} from '../time/types';
import {
  TimePortion,
  UNTRACKED_ACTIVITY_ID,
  useTimePortions,
} from './useTimePortions';
import {STANDARD_ELEMENT_WIDTH} from '../constants';
import {activityDefaultColor_RGBSerialized} from '../ColorPalette';
import * as ColorProcessor from '../ColorProcessor';
import {STANDARD_ELEMENT_BORDER_RADIUS, commonStyles} from '../commonStyles';
import {TimeDisplay} from '../time/TimeDisplay';
import * as ColorPalette from '../ColorPalette';
import useActivityOptionCallbacks from '../activity/useActivityOptionsActions';
import {useTimeSpan, useTimeSpanRealTimeDurationMs} from './useTimeSpan';

const CHART_HEIGHT = 560;
const CHART_WIDTH = STANDARD_ELEMENT_WIDTH;

export type TimePortionsChartProps = TimeSpan;

interface TimePortionElementProps extends TimePortion {
  isTopElement: boolean;
  isBottomElement: boolean;
}

function TimePortionElement(props: TimePortionElementProps) {
  const {isTopElement, isBottomElement, percent, activity} = props;
  const {timeSpan} = useTimeSpan();
  const calculatedHeight = CHART_HEIGHT * (percent / 100);
  const borderRadiusStyleProps = {
    borderTopLeftRadius: isTopElement ? STANDARD_ELEMENT_BORDER_RADIUS : 0,
    borderTopRightRadius: isTopElement ? STANDARD_ELEMENT_BORDER_RADIUS : 0,
    borderBottomLeftRadius: isBottomElement
      ? STANDARD_ELEMENT_BORDER_RADIUS
      : 0,
    borderBottomRightRadius: isBottomElement
      ? STANDARD_ELEMENT_BORDER_RADIUS
      : 0,
  };
  const {timeSpanDurationMs} = useTimeSpanRealTimeDurationMs();
  const {goToActivityHistory} = useActivityOptionCallbacks();
  return (
    <Pressable
      onPress={
        activity.id !== UNTRACKED_ACTIVITY_ID
          ? () => {
              goToActivityHistory(activity.id, timeSpan);
            }
          : () => {}
      }
      style={{
        ...styles.timePortionElement,
        height: calculatedHeight,
        backgroundColor:
          ColorProcessor.serialize(activity.color) ??
          activityDefaultColor_RGBSerialized,
        ...borderRadiusStyleProps,
      }}>
      <Text style={{...commonStyles.textStyle, ...styles.timePortionFont}}>
        {activity.name}
      </Text>
      <TimeDisplay milliseconds={(timeSpanDurationMs * percent) / 100} />
      <Text
        style={{
          ...commonStyles.textStyle,
          ...styles.timePortionFont,
        }}>
        {`${Math.round(percent * 10) / 10}%`}
      </Text>
    </Pressable>
  );
}

export const TimePortionsChart = React.memo((props: TimePortionsChartProps) => {
  const timeSpan = props;
  const {timePortions} = useTimePortions(timeSpan);
  const timePortionsList: TimePortion[] = useMemo(
    () => [...timePortions.values()],
    [timePortions],
  );
  const isTopElement = (index: number) => index === 0;
  const isBottomElement = (index: number) =>
    index === timePortionsList.length - 1;
  return (
    <View>
      {timePortionsList.map((timePortion: TimePortion, index: number) => (
        <TimePortionElement
          isTopElement={isTopElement(index)}
          isBottomElement={isBottomElement(index)}
          {...timePortion}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  timePortionElement: {
    borderWidth: 1,
    borderColor: ColorPalette.SoftBlack_RGBASerialized,
    alignItems: 'center',
    justifyContent: 'center',
    width: CHART_WIDTH,
  },
  timePortionFont: {
    fontSize: 20,
  },
});
