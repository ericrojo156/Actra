import React from 'react';
import {useDispatch} from 'react-redux';
import {joinActivities} from '../activity/useActivityOptionsActions';
import {useTranslation} from '../internationalization/useTranslation';
import {modalClosed} from '../modal/modalActions';
import {SelectActivities} from './SelectActivities';
import {IdProp} from '../types';

export function JoinActivities(props: IdProp) {
  const {id} = props;
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Join');
  const confirmationButtonText = translate('Combine-Activities');
  const dispatch = useDispatch();
  return (
    <SelectActivities
      headerText={`${headerText1} ${headerText2}`}
      confirmationButtonText={confirmationButtonText}
      onConfirmSelection={(selectedIds: string[]) => {
        joinActivities([id, ...selectedIds]);
        dispatch(modalClosed());
      }}
    />
  );
}
