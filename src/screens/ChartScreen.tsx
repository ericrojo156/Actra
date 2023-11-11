import React from 'react';
import {View} from 'react-native';
import GradientBackground from './GradientBackground';
import {
  useTimeSpan,
  useTimeSpanRealTimeDurationMs,
} from '../timeChart/useTimeSpan';
import {TimePortionsChart} from '../timeChart/TimePortionsChart';
import {TimeSpanPickerControls} from '../timeChart/TimeSpanPickerControls';
import {TimeDisplay} from '../time/TimeDisplay';

function ChartScreen() {
  const {timeSpan, setTimeSpan} = useTimeSpan();
  const {timeSpanDurationMs: timeSpanDisplayMs} =
    useTimeSpanRealTimeDurationMs();
  return (
    <GradientBackground>
      <View>
        <View style={{paddingTop: 50}} />
        <TimeDisplay milliseconds={timeSpanDisplayMs} />
        <View style={{paddingTop: 10}} />
        <TimePortionsChart timeSpan={timeSpan} />
        <TimeSpanPickerControls timeSpan={timeSpan} setTimeSpan={setTimeSpan} />
      </View>
    </GradientBackground>
  );
}

export default ChartScreen;
