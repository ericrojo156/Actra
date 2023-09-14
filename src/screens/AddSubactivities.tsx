import React from 'react';
import {useDispatch} from 'react-redux';
import {addSubactivitiesToActivity} from '../activity/useActivityOptionsActions';
import {useTranslation} from '../internationalization/useTranslation';
import {modalClosed} from '../modal/modalActions';
import {ConfirmationTextProps, SelectActivities} from './SelectActivities';
import {IdProp} from '../types';
import useActivities from '../activity/useActivities';
import {Activity} from '../activity/ActivityElement';

export function AddSubactivities(props: IdProp) {
  const {id} = props;
  const {getActivityName} = useActivities();
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Add');
  const confirmationButtonText: ConfirmationTextProps = {
    text1: translate('Add-to'),
    text2: getActivityName(id),
  };
  const dispatch = useDispatch();
  return (
    <SelectActivities
      filterCondition={(activity: Activity) => activity.id !== id}
      headerText={`${headerText1} ${headerText2}`}
      confirmationButtonText={confirmationButtonText}
      onConfirmSelection={(selectedIds: string[]) => {
        addSubactivitiesToActivity(id, selectedIds);
        dispatch(modalClosed());
      }}
    />
  );
}
