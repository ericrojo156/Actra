import React from 'react';
import {useDispatch} from 'react-redux';
import {addSubactivitiesToActivity} from '../activity/useActivityOptionsActions';
import {useTranslation} from '../internationalization/useTranslation';
import {modalClosed} from '../modal/modalActions';
import {ConfirmationTextProps, SelectActivities} from './SelectActivities';
import {FilterCondition, IdProp, IdType} from '../types';
import {useGetActivity} from '../activity/useActivities';
import {Activity} from '../activity/ActivityElement';

export function AddSubactivities(props: IdProp) {
  const {id} = props;
  const {getActivityName, isDescendantOf, isAncestorOf} = useGetActivity();
  const {translate} = useTranslation();
  const headerText1 = translate('Select-Activities');
  const headerText2 = translate('to-Add');
  const confirmationButtonText: ConfirmationTextProps = {
    text1: translate('Add-to'),
    text2: id ? getActivityName(id) : '',
  };
  const dispatch = useDispatch();
  const selectionConditions: FilterCondition<Activity>[] = [
    (activity: Activity) =>
      !isDescendantOf(activity.id, id) && !isAncestorOf(activity.id, id),
  ];
  return (
    <SelectActivities
      parentId={id}
      selectionConditions={selectionConditions}
      headerText={`${headerText1} ${headerText2}`}
      confirmationButtonText={confirmationButtonText}
      onConfirmSelection={(selectedIds: IdType[]) => {
        if (id) {
          addSubactivitiesToActivity(id, selectedIds, dispatch);
        }
        dispatch(modalClosed());
      }}
      canCreateActivityToSelect
    />
  );
}
