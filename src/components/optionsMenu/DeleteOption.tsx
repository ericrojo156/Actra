import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';
import {useTranslation} from '../../internationalization/useTranslation';

function DeleteOption(props: OptionProps) {
  const {style, onPress} = props;
  const {translate} = useTranslation();
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
