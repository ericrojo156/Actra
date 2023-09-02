import {GestureResponderEvent, ViewStyle} from 'react-native';

export interface OptionProps {
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
}
