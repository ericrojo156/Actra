import {joinActivities} from '../../activity/useActivityOptionsActions';
import {useTranslation} from '../../internationalization/useTranslation';
import {SelectActivities} from './SelectActivities';

export function JoinActivities() {
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Join');
  return (
    <SelectActivities
      headerText={`${headerText1} ${headerText2}`}
      onConfirmSelection={joinActivities}
    />
  );
}
