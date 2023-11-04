import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {TimeSpan} from '../time/types';
import {TimePortion, useTimePortions} from './useTimePortions';
import {STANDARD_ELEMENT_WIDTH} from '../constants';
import {activityDefaultColor_RGBSerialized} from '../ColorPalette';
import * as ColorProcessor from '../ColorProcessor';
import {STANDARD_ELEMENT_BORDER_RADIUS} from '../commonStyles';

const CHART_HEIGHT = 700;
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
      }}
    />
  );
}

export function TimePortionsChart(props: TimePortionsChartProps) {
  const {timeSpan} = props;
  const {timePortions} = useTimePortions(timeSpan);
  const timePortionsList: TimePortion[] = useMemo(
    () => [...timePortions.values()],
    [timePortions],
  );
  return (
    <View>
      {timePortionsList.map((timePortion: TimePortion, index: number) => (
        <TimePortionElement
          isTopElement={index === 0}
          isBottomElement={index === timePortionsList.length - 1}
          {...timePortion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  timePortionElement: {width: CHART_WIDTH},
});
