import React, {useState} from 'react';
import {JoinActivities} from '../modalContent/JoinActivities';

export enum ModalType {
  JOIN_ACTIVITIES,
}

export interface ModalState {
  activeModal: ModalType | null;
  setActiveModal: (activeModal: ModalType | null) => void;
}

export function useModal(): ModalState {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  return {
    activeModal,
    setActiveModal,
  };
}

export interface ModalContentProps {
  activeModal: ModalType | null;
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
