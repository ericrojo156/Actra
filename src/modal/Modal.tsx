import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {ModalType} from './modalReducer';
import {
  ModalParams,
  addSubactivitiesModalOpened,
  editActivityModalOpened,
  joinActivitiesModalOpened,
  modalClosed,
} from './modalActions';
import {SelectionModalParams} from '../components/SelectionList';
import {EditActivity} from '../screens/EditActivity';
import {JoinActivities} from '../screens/JoinActivities';
import {IdProp} from '../types';
import {AddSubactivities} from '../screens/AddSubactivities';

export type ActiveModalState = ModalType | null;

export function useModal(): {
  activeModal: ActiveModalState;
  params: ModalParams<any>;
  closeModal: () => void;
  openJoinActivitiesModal: (params: ModalParams<SelectionModalParams>) => void;
  openEditActivityModal: (params: ModalParams<IdProp>) => void;
  openAddSubActivitiesModal: (
    params: ModalParams<SelectionModalParams>,
  ) => void;
} {
  const activeModal = useSelector(
    (state: ApplicationState) => state.modal.activeModal,
  );
  const params = useSelector((state: ApplicationState) => state.modal.params);
  const dispatch = useDispatch();
  const closeModal = useCallback(() => {
    dispatch(modalClosed());
  }, [dispatch]);
  const openJoinActivitiesModal = useCallback(
    (params: ModalParams<SelectionModalParams>) => {
      dispatch(joinActivitiesModalOpened(params));
    },
    [dispatch],
  );
  const openEditActivityModal = useCallback(
    (params: ModalParams<IdProp>) => {
      dispatch(editActivityModalOpened(params));
    },
    [dispatch],
  );
  const openAddSubActivitiesModal = useCallback(
    (params: ModalParams<SelectionModalParams>) => {
      dispatch(addSubactivitiesModalOpened(params));
    },
    [dispatch],
  );
  return {
    activeModal,
    closeModal,
    openJoinActivitiesModal,
    openEditActivityModal,
    openAddSubActivitiesModal,
    params,
  };
}

export interface ModalContentProps extends ModalParams<any> {
  activeModal: ActiveModalState;
}

export function ModalContent(props: ModalContentProps) {
  const {activeModal, params} = props;
  switch (activeModal) {
    case ModalType.JOIN_ACTIVITIES: {
      const {id} = params as IdProp;
      return <JoinActivities id={id} />;
    }
    case ModalType.EDIT_ACTIVITY: {
      const {id} = params as IdProp;
      return <EditActivity id={id} />;
    }
    case ModalType.ADD_SUBACTIVITIES: {
      const {id} = params as IdProp;
      return <AddSubactivities id={id} />;
    }
    default: {
      return null;
    }
  }
}
