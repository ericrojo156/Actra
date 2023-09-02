import React from 'react';
import PressableControl from '../PressableIcon';
import {OptionProps} from './types';

function JoinOption(props: OptionProps) {
  const {style, onPress} = props;
  return (
    <PressableControl
      style={style}
      iconName="axis-z-arrow"
      label={'dict.Join'}
      onPress={onPress}
    />
  );
}

export default JoinOption;
