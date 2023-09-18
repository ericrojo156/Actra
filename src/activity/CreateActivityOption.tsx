import React from 'react';
import {StyleSheet} from 'react-native';
import PressableIcon from '../components/PressableIcon';
import {Color} from '../ColorPalette';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import useActivityOptionCallbacks from './useActivityOptionsActions';

const DIAMETER = 65;

export default function CreateActivityOption(props: {color: Color}) {
  const {onCreateActivityOption} = useActivityOptionCallbacks();
  const {color} = props;
  return (
    <PressableIcon
      onPress={onCreateActivityOption}
      style={{
        backgroundColor: ColorProcessor.serialize(color),
        ...styles.circularButton,
      }}
      iconName="plus"
    />
  );
}

const styles = StyleSheet.create({
  circularButton: {
    height: DIAMETER,
    width: DIAMETER,
    borderRadius: DIAMETER / 2,
    borderWidth: 2,
    borderColor: ColorPalette.OffWhite_RGBSerialized,
  },
});