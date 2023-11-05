import React, {useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TimeSpan} from '../time/types';
import {TimePortion, useTimePortions} from './useTimePortions';
import {STANDARD_ELEMENT_WIDTH} from '../constants';
import {activityDefaultColor_RGBSerialized} from '../ColorPalette';
import * as ColorProcessor from '../ColorProcessor';
import {STANDARD_ELEMENT_BORDER_RADIUS, commonStyles} from '../commonStyles';

const CHART_HEIGHT = 650;
const CHART_WIDTH = STANDARD_ELEMENT_WIDTH;

export interface TimePortionsChartProps {
  timeSpan: TimeSpan;
}

interface TimePortionElementProps extends TimePortion {
  isTopElement: boolean;
  isBottomElement: boolean;
}

function TimePortionElement(props: TimePortionElementProps) {
  const {isTopElement, isBottomElement, percent, activity} = props;
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
  return (
    <View
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
      <Text
        style={{
          ...commonStyles.textStyle,
          ...styles.timePortionFont,
        }}>{`${percent}%`}</Text>
    </View>
  );
}

export function TimePortionsChart(props: TimePortionsChartProps) {
  const {timeSpan} = props;
  const {timePortions} = useTimePortions(timeSpan);
  const timePortionsList: TimePortion[] = useMemo(
    () => [...timePortions.values()],
    [timePortions],
  );
  const isTopElement = (index: number) => index === 0;
  const isBottomElement = (index: number) =>
    index === timePortionsList.length - 1;
  return (
    <View style={{marginTop: 30}}>
      {timePortionsList.map((timePortion: TimePortion, index: number) => (
        <TimePortionElement
          isTopElement={isTopElement(index)}
          isBottomElement={isBottomElement(index)}
          {...timePortion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  timePortionElement: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CHART_WIDTH,
  },
  timePortionFont: {
    fontSize: 20,
  },
});
