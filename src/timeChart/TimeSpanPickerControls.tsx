import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {TimeSpan} from '../time/types';
import * as ColorPalette from '../ColorPalette';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {commonStyles} from '../commonStyles';
import {TimeSpanElement} from '../time/TimeSpanElement';
import {STANDARD_ELEMENT_HEIGHT, STANDARD_ELEMENT_WIDTH} from '../constants';

export interface TimeSpanPickerControlsProps {
  timeSpan: TimeSpan;
  setTimeSpan: (timeSpan: TimeSpan) => void;
}

export function TimeSpanPickerControls(props: TimeSpanPickerControlsProps) {
  const {timeSpan} = props;
  const timeSpanElementStyle = {
    ...commonStyles.container,
    ...commonStyles.roundedElementBorder,
    ...styles.timeSpanElement,
  };
  const openCalendarPicker = useCallback(() => {
    
  }, []);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <MaterialCommunityIcons
        name="chevron-left"
        color={ColorPalette.OffWhite_RGBSerialized}
        size={40}
      />
      <Pressable onPress={openCalendarPicker}>
        <TimeSpanElement style={timeSpanElementStyle} timeSpan={timeSpan} />
      </Pressable>
      <MaterialCommunityIcons
        name="chevron-right"
        color={ColorPalette.OffWhite_RGBSerialized}
        size={40}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  timeSpanElement: {
    width: STANDARD_ELEMENT_WIDTH,
    height: STANDARD_ELEMENT_HEIGHT,
    padding: 10,
  },
});
