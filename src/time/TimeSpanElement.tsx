import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import RightArrow from '../../assets/RightArrow';
import {DateTimeDisplay} from './TimeDisplay';
import {TimeSpan} from './types';

interface TimeSpanElementProps {
  timeSpan: TimeSpan;
  style?: StyleProp<ViewStyle>;
  showDate?: boolean;
}

export const TimeSpanElement = React.memo((props: TimeSpanElementProps) => {
  const {timeSpan, style = {}, showDate = true} = props;
  return (
    <View style={style}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <DateTimeDisplay
          showDate={showDate}
          milliseconds={timeSpan.startTimeEpochMilliseconds}
        />
        <RightArrow />
        <DateTimeDisplay
          showDate={showDate}
          milliseconds={timeSpan.endTimeEpochMilliseconds}
        />
      </View>
    </View>
  );
});
