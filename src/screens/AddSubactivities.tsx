import React from 'react';
import {useDispatch} from 'react-redux';
import {addSubactivitiesToActivity} from '../activity/useActivityOptionsActions';
import {useTranslation} from '../internationalization/useTranslation';
import {modalClosed} from '../modal/modalActions';
import {ConfirmationTextProps, SelectActivities} from './SelectActivities';
import {IdProp, IdType} from '../types';
import {useGetActivity} from '../activity/useActivities';

export function AddSubactivities(props: IdProp) {
  const {id} = props;

  const {getActivityName} = useGetActivity();
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Add');
  const confirmationButtonText: ConfirmationTextProps = {
    text1: translate('Add-to'),
    text2: id ? getActivityName(id) : '',
  };
  const dispatch = useDispatch();

  return (
    <SelectActivities
      parentId={id}
      headerText={`${headerText1} ${headerText2}`}
      confirmationButtonText={confirmationButtonText}
      onConfirmSelection={(selectedIds: IdType[]) => {
        if (id) {
          addSubactivitiesToActivity(id, selectedIds);
        }
        dispatch(modalClosed());
      }}
    />
  );
}
