import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';

function EditOption(props: OptionProps) {
  const {style, onPress} = props;
  return (
    <PressableIcon
      style={style}
      iconName="pencil"
      label={'dict.Edit'}
      onPress={onPress}
    />
  );
}

export default EditOption;
