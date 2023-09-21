import React from 'react';
import {useDispatch} from 'react-redux';
import {joinActivities} from '../activity/useActivityOptionsActions';
import {useTranslation} from '../internationalization/useTranslation';
import {modalClosed} from '../modal/modalActions';
import {SelectActivities} from './SelectActivities';
import {IdProp, IdType} from '../types';
import {useGetActivity} from '../activity/useActivities';

export function JoinActivities(props: IdProp) {
  const {id} = props;
  const {getActivityName} = useGetActivity();
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Join');
  const confirmationButtonText = {
    text1: translate('Combine-Activities-with'),
    text2: id !== null ? getActivityName(id) : '',
  };
  const dispatch = useDispatch();
  return (
    <SelectActivities
      parentId={id}
      headerText={`${headerText1} ${headerText2}`}
      confirmationButtonText={confirmationButtonText}
      onConfirmSelection={(selectedIds: IdType[]) => {
        if (id) {
          joinActivities([id, ...selectedIds], dispatch);
        }
        dispatch(modalClosed());
      }}
    />
  );
}
