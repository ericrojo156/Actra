import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import GradientBackground from './GradientBackground';
import {useTimeSpan} from '../timeChart/useTimeSpan';
import {TimePortionsChart} from '../timeChart/TimePortionsChart';
import {TimeSpanPickerControls} from '../timeChart/TimeSpanPickerControls';
import {TimeDisplay} from '../time/TimeDisplay';
import {getDuration} from '../time/utils';
import {STANDARD_TICK_MS} from '../time/constants';

function ChartScreen() {
  const {timeSpan, setTimeSpan} = useTimeSpan();
  const [timeSpanDisplayMs, setTimeSpanDisplayMs] = useState(
    getDuration(timeSpan),
  );
  useEffect(() => {
    const handle = setInterval(() => {
      setTimeSpanDisplayMs(getDuration(timeSpan));
    }, STANDARD_TICK_MS);
    return () => {
      clearInterval(handle);
    };
  }, [timeSpan]);
  return (
    <GradientBackground>
      <View>
        <View style={{paddingTop: 50}} />
        <TimeDisplay milliseconds={timeSpanDisplayMs} />
        <View style={{paddingTop: 10}} />
        <TimePortionsChart timeSpan={timeSpan} />
        <TimeSpanPickerControls setTimeSpan={setTimeSpan} />
      </View>
    </GradientBackground>
  );
}

export default ChartScreen;
