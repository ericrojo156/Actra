import React, {ReactElement} from 'react';
import TouchableScale from 'react-native-touchable-scale';

const DEFAULT_ACTIVE_SCALE = 0.95;

interface PressableProps {
  activeScale?: number;
  onPress?: (event?: any) => void;
  onPressIn?: (event?: any) => void;
  onPressOut?: (event?: any) => void;
  renderElement?: () => ReactElement;
  children?: any;
  style?: any;
}

function CustomPressable(props: PressableProps) {
  const {
    activeScale,
    children,
    renderElement,
    onPress = () => {},
    onPressIn = () => {},
    onPressOut = () => {},
    style,
  } = props;
  return (
    <TouchableScale
      style={style ?? {}}
      tension={200}
      activeScale={activeScale ?? DEFAULT_ACTIVE_SCALE}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      {children ?? renderElement?.()}
    </TouchableScale>
  );
}

export default CustomPressable;
