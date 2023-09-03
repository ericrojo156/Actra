import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';

function JoinOption(props: OptionProps) {
  const {style, onPress} = props;
  return (
    <PressableIcon
      style={style}
      iconName="axis-z-arrow"
      label={'dict.Join'}
      onPress={onPress}
    />
  );
}

export default JoinOption;
