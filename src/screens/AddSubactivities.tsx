import React from 'react';
import {useDispatch} from 'react-redux';
import {addSubactivitiesToActivity} from '../activity/useActivityOptionsActions';
import {useTranslation} from '../internationalization/useTranslation';
import {modalClosed} from '../modal/modalActions';
import {SelectActivities} from './SelectActivities';
import {IdProp} from '../types';

export function AddSubactivities(props: IdProp) {
  const {id} = props;
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Add');
  const confirmationButtonText = translate('Add-to-Activity');
  const dispatch = useDispatch();
  return (
    <SelectActivities
      headerText={`${headerText1} ${headerText2}`}
      confirmationButtonText={confirmationButtonText}
      onConfirmSelection={(selectedIds: string[]) => {
        addSubactivitiesToActivity(id, selectedIds);
        dispatch(modalClosed());
      }}
    />
  );
}
