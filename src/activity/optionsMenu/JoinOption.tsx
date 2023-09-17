import React, {useCallback} from 'react';
import PressableIcon from '../../components/PressableIcon';
import {OptionProps} from './types';
import {useTranslation} from '../../internationalization/useTranslation';
import useActivityOptionCallbacks from '../useActivityOptionsActions';

function JoinOption(props: OptionProps) {
  const {style, id} = props;
  const {translate} = useTranslation();
  const {onJoinActivityOption} = useActivityOptionCallbacks();

  const onPress = useCallback(
    () => onJoinActivityOption(id),
    [onJoinActivityOption, id],
  );
  return (
    <PressableIcon
      style={style}
      iconName="axis-z-arrow"
      label={translate('Join')}
      onPress={onPress}
    />
  );
}

export default React.memo(JoinOption);
