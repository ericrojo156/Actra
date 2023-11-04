import React from 'react';
import {View} from 'react-native';
import GradientBackground from './GradientBackground';
import {useTimeSpan} from '../timeChart/useTimeSpan';
import {TimePortionsChart} from '../timeChart/TimePortionsChart';
import {TimeSpanPickerControls} from '../timeChart/TimeSpanPickerControls';

function ChartScreen() {
  const {timeSpan, setTimeSpan} = useTimeSpan();
  return (
    <GradientBackground>
      <View>
        <TimePortionsChart timeSpan={timeSpan} />
        <TimeSpanPickerControls setTimeSpan={setTimeSpan} />
      </View>
    </GradientBackground>
  );
}

export default ChartScreen;
