import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';

function HistoryOption(props: OptionProps) {
  const {style, onPress} = props;
  return (
    <PressableIcon
      style={style}
      iconName="book-open-variant"
      label={'dict.History'}
      onPress={onPress}
    />
  );
}

export default HistoryOption;
