import React, {useCallback} from 'react';
import {JoinActivities} from './content/JoinActivities';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {ModalType} from './modalReducer';
import {
  ModalParams,
  editActivityModalOpened,
  joinActivitiesModalOpened,
  modalClosed,
} from './modalActions';
import {SelectionModalParams} from '../components/SelectionList';
import {EditActivity} from '../screens/EditActivity';
import {IdProp} from '../types';

export type ActiveModalState = ModalType | null;

export function useModal(): {
  activeModal: ActiveModalState;
  params: ModalParams<any>;
  closeModal: () => void;
  openJoinActivitiesModal: (params: ModalParams<SelectionModalParams>) => void;
  openEditActivityModal: (params: ModalParams<IdProp>) => void;
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
  return {
    activeModal,
    closeModal,
    openJoinActivitiesModal,
    openEditActivityModal,
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
      return <JoinActivities />;
    }
    case ModalType.EDIT_ACTIVITY: {
      const {id} = params as IdProp;
      return <EditActivity id={id} />;
    }
    default: {
      return null;
    }
  }
}
