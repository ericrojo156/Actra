import {useCallback} from 'react';
import {ActionSheetIOS} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from '../internationalization/useTranslation';
import {useSelectionModal, SELECTION_TYPE} from '../components/SelectionList';
import {
  createActivityModalOpened,
  editActivityModalOpened,
} from '../modal/modalActions';
import {useUpdateActivity} from './useActivities';
import {useNavigation} from '@react-navigation/native';
import {IdType} from '../types';

export function joinActivities(ids: IdType[]): void {
  console.log(`join activities: ${ids}`);
}

export function addSubactivitiesToActivity(
  parentId: IdType,
  subactivitiesIds: IdType[],
): void {
  console.log(`add subactivities ${subactivitiesIds} to activity ${parentId}`);
}

export default function useActivityOptionCallbacks() {
  const {translate} = useTranslation();
  const dispatch = useDispatch();
  const {deleteActivity} = useUpdateActivity();
  const navigation = useNavigation();
  const onDeleteActivityOption = useCallback(
    (id: IdType) => {
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
  const {openAddSubactivitiesModal, openJoinActivitiesModal} =
    useSelectionModal();
  const onJoinActivityOption = useCallback(
    (id: IdType) => {
      openJoinActivitiesModal({
        id,
        selectionType: SELECTION_TYPE.MULTI_SELECT,
        onConfirm: (selectedItems: IdType[]) =>
          joinActivities([id, ...selectedItems]),
      });
    },
    [openJoinActivitiesModal],
  );
  const onEditActivityOption = useCallback(
    (id: IdType) => {
      dispatch(editActivityModalOpened({params: {id}}));
    },
    [dispatch],
  );
  const onHistoryActivityOption = useCallback(
    (id: IdType) => {
      // @ts-ignore
      navigation.navigate('History', {id});
    },
    [navigation],
  );
  const onAddSubactivityOption = useCallback(
    (id: IdType) => {
      openAddSubactivitiesModal({
        id,
        selectionType: SELECTION_TYPE.MULTI_SELECT,
        onConfirm: (selectedItems: IdType[]) =>
          addSubactivitiesToActivity(id, selectedItems),
      });
    },
    [openAddSubactivitiesModal],
  );

  const onCreateActivityOption = useCallback(() => {
    dispatch(createActivityModalOpened());
  }, [dispatch]);

  return {
    onDeleteActivityOption,
    onJoinActivityOption,
    onEditActivityOption,
    onHistoryActivityOption,
    onAddSubactivityOption,
    onCreateActivityOption,
  };
}
