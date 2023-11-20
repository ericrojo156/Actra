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
import {TimeSpanElement} from '../time/TimeSpanElement';

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
        <TimePortionsChart {...timeSpan} />
        <TimeSpanPickerControls {...timeSpan} setTimeSpan={setTimeSpan} />
        <View style={{paddingTop: 10, paddingBottom: 10, alignItems: 'center'}}>
          <TimeSpanElement showDate={false} timeSpan={timeSpan} />
        </View>
      </View>
    </GradientBackground>
  );
}

export default ChartScreen;
