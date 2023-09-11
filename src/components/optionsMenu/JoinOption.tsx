import React from 'react';
import PressableIcon from '../PressableIcon';
import {OptionProps} from './types';
import {useTranslation} from '../../internationalization/useTranslation';

function JoinOption(props: OptionProps) {
  const {style, onPress} = props;
  const {translate} = useTranslation();
  return (
    <PressableIcon
      style={style}
      iconName="axis-z-arrow"
      label={translate('Join')}
      onPress={onPress}
    />
  );
}

export default JoinOption;
