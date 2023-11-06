import {useCallback} from 'react';
import {ActionSheetIOS} from 'react-native';
import {AnyAction, Dispatch} from 'redux';
import {useDispatch} from 'react-redux';
import {useTranslation} from '../internationalization/useTranslation';
import {useSelectionModal, SELECTION_TYPE} from '../components/SelectionList';
import {
  createActivityModalOpened,
  editActivityModalOpened,
} from '../modal/modalActions';
import {useNavigation} from '@react-navigation/native';
import {IdType} from '../types';
import {
  joinedActivities,
  addSubactivitiesRequested,
  deletedActivity,
} from './redux/activityActions';
import {TimeSpan} from '../time/types';

export function joinActivities(
  targetParentId: IdType,
  ids: IdType[],
  dispatch: Dispatch<AnyAction>,
): void {
  dispatch(joinedActivities(targetParentId, ids));
}

export function addSubactivitiesToActivity(
  parentId: IdType,
  subactivitiesIds: IdType[],
  dispatch: Dispatch<AnyAction>,
): void {
  dispatch(addSubactivitiesRequested(parentId, subactivitiesIds));
}

export default function useActivityOptionCallbacks() {
  const {translate} = useTranslation();
  const dispatch = useDispatch();
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
            dispatch(deletedActivity(id));
          }
        },
      );
    },
    [dispatch, translate],
  );
  const {openAddSubactivitiesModal, openJoinActivitiesModal} =
    useSelectionModal();
  const onJoinActivityOption = useCallback(
    (id: IdType) => {
      openJoinActivitiesModal({
        id,
        selectionType: SELECTION_TYPE.MULTI_SELECT,
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
  const goToActivityHistory = useCallback(
    (id: IdType, timeSpan: TimeSpan | null = null) => {
      // @ts-ignore
      navigation.navigate('History', {id, timeSpan: timeSpan});
    },
    [navigation],
  );
  const onAddSubactivityOption = useCallback(
    (id: IdType) => {
      openAddSubactivitiesModal({
        id,
        selectionType: SELECTION_TYPE.MULTI_SELECT,
      });
    },
    [openAddSubactivitiesModal],
  );

  const onCreateActivityOption = useCallback(
    (parentId?: IdType, shouldAddAsSubactivity?: boolean) => {
      dispatch(
        createActivityModalOpened(
          parentId ?? null,
          shouldAddAsSubactivity ?? false,
        ),
      );
    },
    [dispatch],
  );

  return {
    onDeleteActivityOption,
    onJoinActivityOption,
    onEditActivityOption,
    goToActivityHistory,
    onAddSubactivityOption,
    onCreateActivityOption,
  };
}
