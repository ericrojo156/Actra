import React, {useCallback} from 'react';
import PressableIcon from '../../components/PressableIcon';
import {OptionProps} from './types';
import {useTranslation} from '../../internationalization/useTranslation';
import useActivityOptionCallbacks from '../useActivityOptionsActions';

function DeleteOption(props: OptionProps) {
  const {style, id} = props;
  const {onDeleteActivityOption} = useActivityOptionCallbacks();
  const {translate} = useTranslation();
  const onPress = useCallback(
    () => onDeleteActivityOption(id),
    [onDeleteActivityOption, id],
  );
  return (
    <PressableIcon
      style={style}
      iconName="delete"
      label={translate('Delete')}
      onPress={onPress}
    />
  );
}

export default React.memo(DeleteOption);
