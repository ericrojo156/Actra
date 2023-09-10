import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';
import {useTranslation, Language} from '../../internationalization/useTranslation';

function HistoryOption(props: OptionProps) {
  const {style, onPress} = props;
  const {translate} = useTranslation();
  return (
    <PressableIcon
      style={style}
      iconName="book-open-variant"
      label={translate('History')}
      onPress={onPress}
    />
  );
}

export default HistoryOption;
