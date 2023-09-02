import React from 'react';
import PressableControl from '../PressableIcon';
import {OptionProps} from './types';

function DeleteOption(props: OptionProps) {
  const {style, onPress} = props;
  return (
    <PressableControl
      style={style}
      iconName="delete"
      label={'dict.Delete'}
      onPress={onPress}
    />
  );
}

export default DeleteOption;
