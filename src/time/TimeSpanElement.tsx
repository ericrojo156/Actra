import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import RightArrow from '../../assets/RightArrow';
import {DateTimeDisplay} from './TimeDisplay';
import {TimeSpan} from './types';

export function TimeSpanElement(props: {
  timeSpan: TimeSpan;
  style?: StyleProp<ViewStyle>;
}) {
  const {timeSpan, style = {}} = props;
  return (
    <View style={style}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <DateTimeDisplay milliseconds={timeSpan.startTimeEpochMilliseconds} />
        <RightArrow />
        <DateTimeDisplay milliseconds={timeSpan.endTimeEpochMilliseconds} />
      </View>
    </View>
  );
}
