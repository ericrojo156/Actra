import React from 'react';
import {StyleSheet, Text, GestureResponderEvent} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ColorPalette from '../ColorPalette';
import Pressable from './Pressable';

export const ACTRA_FUNCTION_OPTION_ICON_SIZE = 40;

interface ActraFunctionProps {
  label: string;
  style?: any;
  onPress?: (event: GestureResponderEvent) => void;
  iconName?: string;
  children?: any;
}

function PressableIcon(props: ActraFunctionProps) {
  const {label, style, onPress = () => {}, iconName, children} = props;
  const content = children ?? (
    <MaterialCommunityIcons
      name={iconName ?? ''}
      size={ACTRA_FUNCTION_OPTION_ICON_SIZE}
      color={ColorPalette.OffWhite_RGBSerialized}
    />
  );
  return (
    <Pressable
      activeScale={0.85}
      style={{...styles.container, ...style}}
      onPress={onPress}>
      {content}
      <Text style={styles.textStyle}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: ColorPalette.OffWhite_RGBSerialized,
  },
});

export default PressableIcon;
