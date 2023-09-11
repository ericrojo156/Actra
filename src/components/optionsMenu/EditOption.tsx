import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';
import {useTranslation} from '../../internationalization/useTranslation';

function EditOption(props: OptionProps) {
  const {style, onPress} = props;
  const {translate} = useTranslation();
  return (
    <PressableIcon
      style={style}
      iconName="pencil"
      label={translate('Edit')}
      onPress={onPress}
    />
  );
}

export default EditOption;
