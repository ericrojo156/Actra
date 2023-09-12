import {useDispatch} from 'react-redux';
import {joinActivities} from '../activity/useActivityOptionsActions';
import {useTranslation} from '../internationalization/useTranslation';
import {modalClosed} from '../modal/modalActions';
import {SelectActivities} from './SelectActivities';

export function JoinActivities() {
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Join');
  const dispatch = useDispatch();
  return (
    <SelectActivities
      headerText={`${headerText1} ${headerText2}`}
      onConfirmSelection={(ids: string[]) => {
        joinActivities(ids);
        dispatch(modalClosed());
      }}
    />
  );
}
