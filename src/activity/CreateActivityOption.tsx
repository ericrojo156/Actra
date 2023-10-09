import React from 'react';
import {StyleSheet, View} from 'react-native';
import PressableIcon from '../components/PressableIcon';
import {Color} from '../ColorPalette';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import useActivityOptionCallbacks from './useActivityOptionsActions';

const DIAMETER = 65;

interface CreateActivityProps {
  color: Color;
}

export function CreateActivityOption(props: CreateActivityProps) {
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

export function FloatingCreateActivityButton(props: {
  translateX?: number;
  translateY?: number;
}) {
  const {translateY = 350, translateX = 90} = props;
  return (
    <View
      style={{
        zIndex: 10,
        position: 'absolute',
        transform: [{translateX}, {translateY}],
      }}>
      <CreateActivityOption color={ColorPalette.SoftBlack} />
    </View>
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
