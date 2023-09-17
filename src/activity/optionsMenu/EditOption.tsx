import React, {useCallback} from 'react';
import PressableIcon from '../../components/PressableIcon';
import {OptionProps} from './types';
import {useTranslation} from '../../internationalization/useTranslation';
import useActivityOptionCallbacks from '../useActivityOptionsActions';

function EditOption(props: OptionProps) {
  const {style, id} = props;
  const {translate} = useTranslation();
  const {onEditActivityOption} = useActivityOptionCallbacks();

  const onPress = useCallback(
    () => onEditActivityOption(id),
    [onEditActivityOption, id],
  );
  return (
    <PressableIcon
      style={style}
      iconName="pencil"
      label={translate('Edit')}
      onPress={onPress}
    />
  );
}

export default React.memo(EditOption);
