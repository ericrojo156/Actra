import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';
import {useTranslation, Language} from '../../hooks/useTranslation';

function DeleteOption(props: OptionProps) {
  const {style, onPress} = props;
  const {translate} = useTranslation(Language.ENGLISH);
  return (
    <PressableIcon
      style={style}
      iconName="delete"
      label={translate('Delete')}
      onPress={onPress}
    />
  );
}

export default DeleteOption;
