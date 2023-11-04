import React from 'react';
import {View, Text} from 'react-native';
import {TimeSpan} from '../time/types';

export interface TimeSpanPickerControlsProps {
  setTimeSpan: (timeSpan: TimeSpan) => void;
}

export function TimeSpanPickerControls(_props: TimeSpanPickerControlsProps) {
  return (
    <View>
      <Text />
    </View>
  );
}
