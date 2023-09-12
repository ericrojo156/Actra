import {useCallback} from 'react';
import {ActionSheetIOS} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from '../internationalization/useTranslation';
import {useSelectionModal, SELECTION_TYPE} from '../components/SelectionList';
import {editActivityModalOpened} from '../modal/modalActions';
import useActivities from './useActivities';
import {useNavigation} from '@react-navigation/native';

export function joinActivities(ids: string[]) {
  console.log(`join activities: ${ids}`);
}

export default function useActivityOptionCallbacks() {
  const {translate} = useTranslation();
  const dispatch = useDispatch();
  const {deleteActivity} = useActivities();
  const navigation = useNavigation();
  const onDeleteActivityOption = useCallback(
    (id: string) => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [translate('Cancel'), translate('Delete-Activity')],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            deleteActivity(id);
          }
        },
      );
    },
    [deleteActivity, translate],
  );
  const {openJoinActivitiesModal} = useSelectionModal();
  const onJoinActivityOption = useCallback(
    (id: string) => {
      openJoinActivitiesModal({
        id,
        selectionType: SELECTION_TYPE.MULTI_SELECT,
        onConfirm: (selectedItems: string[]) =>
          joinActivities([id, ...selectedItems]),
      });
    },
    [openJoinActivitiesModal],
  );
  const onEditActivityOption = useCallback(
    (id: string) => {
      dispatch(editActivityModalOpened({params: {id}}));
    },
    [dispatch],
  );
  const onHistoryActivityOption = useCallback(
    (id: string) => {
      // @ts-ignore
      navigation.navigate('History', {id});
    },
    [navigation],
  );
  const onAddSubactivityOption = useCallback((id: string) => {
    console.log(`add subactivity: ${id}`);
  }, []);
  return {
    onDeleteActivityOption,
    onJoinActivityOption,
    onEditActivityOption,
    onHistoryActivityOption,
    onAddSubactivityOption,
  };
}
