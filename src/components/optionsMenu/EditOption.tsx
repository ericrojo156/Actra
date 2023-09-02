import React from 'react';
import PressableControl from '../PressableIcon';
import {OptionProps} from './types';

function EditOption(props: OptionProps) {
  const {style, onPress} = props;
  return (
    <PressableControl
      style={style}
      iconName="pencil"
      label={'dict.Edit'}
      onPress={onPress}
    />
  );
}

export default EditOption;
