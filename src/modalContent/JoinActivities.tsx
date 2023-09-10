import {joinActivities} from '../activity/useActivityOptionsActions';
import {useTranslation, Language} from '../hooks/useTranslation';
import {SelectActivities} from './SelectActivities';

export function JoinActivities() {
  const {translate} = useTranslation(Language.ENGLISH);
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Join');
  return (
    <SelectActivities
      headerText={`${headerText1} ${headerText2}`}
      onConfirmSelection={joinActivities}
    />
  );
}
