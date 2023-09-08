import {useCallback} from 'react';
import {ActionSheetIOS} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  deleteActivityOptionInvoked,
  deleteActivity,
  joinActivityOptionInvoked,
  editActivityOptionInvoked,
  historyActivityOptionInvoked,
  addSubactivityOptionInvoked,
} from './actions';
import {SELECTION_TYPE, openSelectionModal} from '../components/modal';

function joinActivities(ids: string[]) {
  console.log(`join activities: ${ids}`);
}

export default function useActivityOptionCallbacks() {
  const dispatch = useDispatch();
  const onDeleteActivityOption = useCallback(
    (id: string) => {
      dispatch(deleteActivityOptionInvoked(id));
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['dict.Cancel', 'dict.DeleteActivity'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            dispatch(deleteActivity(id));
          }
        },
      );
    },
    [dispatch],
  );
  const onJoinActivityOption = useCallback(
    (id: string) => {
      dispatch(joinActivityOptionInvoked(id));
      openSelectionModal({
        id,
        selectionType: SELECTION_TYPE.MULTI_SELECT,
        onConfirm: (selectedItems: string[]) =>
          joinActivities([id, ...selectedItems]),
      });
    },
    [dispatch],
  );
  const onEditActivityOption = useCallback(
    (id: string) => {
      dispatch(editActivityOptionInvoked(id));
    },
    [dispatch],
  );
  const onHistoryActivityOption = useCallback(
    (id: string) => {
      dispatch(historyActivityOptionInvoked(id));
    },
    [dispatch],
  );
  const onAddSubactivityOption = useCallback(
    (id: string) => {
      dispatch(addSubactivityOptionInvoked(id));
    },
    [dispatch],
  );
  return {
    onDeleteActivityOption,
    onJoinActivityOption,
    onEditActivityOption,
    onHistoryActivityOption,
    onAddSubactivityOption,
  };
}
