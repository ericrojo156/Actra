import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import {StyleProp, ViewStyle, View, StyleSheet} from 'react-native';
import {commonStyles} from '../commonStyles';
import {STANDARD_ELEMENT_WIDTH, ELEMENT_HEIGHT} from '../constants';
import useActivities from '../activity/useActivities';

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

export function IntervalElement(props: IntervalElementProps) {
  const {parentActivityId, width} = props;
  let intervalStyle: StyleProp<ViewStyle> = {
    ...commonStyles.container,
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
  return <View style={intervalStyle} />;
}

export const styles = StyleSheet.create({
  expandableActivityElement: {
    backgroundColor: ColorPalette.activityDefaultColor_RGBSerialized,
  },
  intervalElement: {
    width: STANDARD_ELEMENT_WIDTH,
    height: ELEMENT_HEIGHT,
  },
  textStyle: {
    fontSize: 20,
  },
});
