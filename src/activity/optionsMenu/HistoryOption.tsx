import React, {useCallback} from 'react';
import PressableIcon from '../../components/PressableIcon';
import {OptionProps} from './types';
import {useTranslation} from '../../internationalization/useTranslation';
import useActivityOptionCallbacks from '../useActivityOptionsActions';

function HistoryOption(props: OptionProps) {
  const {style, id} = props;
  const {translate} = useTranslation();
  const {goToActivityHistory: goToActivityHistory} =
    useActivityOptionCallbacks();
  const onPress = useCallback(
    () => goToActivityHistory(id),
    [goToActivityHistory, id],
  );
  return (
    <PressableIcon
      style={style}
      iconName="book-open-variant"
      label={translate('History')}
      onPress={onPress}
    />
  );
}

export default React.memo(HistoryOption);
