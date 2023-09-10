import React, {useCallback} from 'react';
import {JoinActivities} from './content/JoinActivities';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {ModalType} from './modalReducer';
import {
  ModalParams,
  joinActivitiesModalOpened,
  modalClosed,
} from './modalActions';
import {SelectionModalParams} from '../components/SelectionList';

export type ActiveModalState = ModalType | null;

export function useModal(): {
  activeModal: ActiveModalState;
  closeModal: () => void;
  openJoinActivitiesModal: (params: ModalParams<SelectionModalParams>) => void;
} {
  const activeModal = useSelector(
    (state: ApplicationState) => state.modal.activeModal,
  );
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
  return {activeModal, closeModal, openJoinActivitiesModal};
}

export interface ModalContentProps {
  activeModal: ActiveModalState;
}

export function ModalContent(props: ModalContentProps) {
  const {activeModal} = props;
  switch (activeModal) {
    case ModalType.JOIN_ACTIVITIES: {
      return <JoinActivities />;
    }
    default: {
      return null;
    }
  }
}
