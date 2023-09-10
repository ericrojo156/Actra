import React from 'react';
import {Text, GestureResponderEvent, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ColorPalette from '../ColorPalette';
import CustomPressable from './Pressable';
import {commonStyles} from '../commonStyles';

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
    <CustomPressable
      activeScale={0.85}
      style={{...commonStyles.container, ...styles.iconContainer, ...style}}
      onPress={onPress}>
      {content}
      <Text style={commonStyles.textStyle}>{label}</Text>
    </CustomPressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: {},
});

export default PressableIcon;
