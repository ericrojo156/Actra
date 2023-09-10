import {SelectionModalParams} from '../components/SelectionList';
import {BaseAction} from '../types';

import ModalState from './ModalState';
import {
  CLOSE_MODAL,
  JOIN_ACTIVITIES_OPENED,
  ModalOpenAction,
} from './modalActions';

export const enum ModalType {
  JOIN_ACTIVITIES,
}

const defaultModalState: ModalState = {
  activeModal: null,
};

export default function IntervalsReducer(
  state: ModalState = defaultModalState,
  action: BaseAction,
) {
  switch (action.type) {
    case CLOSE_MODAL: {
      return {
        ...state,
        activeModal: null,
      };
    }
    case JOIN_ACTIVITIES_OPENED: {
      const {params} = (action as ModalOpenAction<SelectionModalParams>)
        .payload;
      return {
        ...state,
        activeModal: ModalType.JOIN_ACTIVITIES,
        params,
      };
    }
    default: {
      return state;
    }
  }
}
