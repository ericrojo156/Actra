import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';

function DeleteOption(props: OptionProps) {
  const {style, onPress} = props;
  return (
    <PressableIcon
      style={style}
      iconName="delete"
      label={'dict.Delete'}
      onPress={onPress}
    />
  );
}

export default DeleteOption;
