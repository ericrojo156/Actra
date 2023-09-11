import {SelectionModalParams} from '../components/SelectionList';
import {BaseAction, IdProp} from '../types';

import ModalState from './ModalState';
import {
  CLOSE_MODAL,
  EDIT_ACTIVITY_OPENED,
  JOIN_ACTIVITIES_OPENED,
  ModalOpenAction,
} from './modalActions';

export const enum ModalType {
  JOIN_ACTIVITIES,
  EDIT_ACTIVITY,
}

const defaultModalState: ModalState = {
  activeModal: null,
  params: {},
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
    case EDIT_ACTIVITY_OPENED: {
      const {params} = (action as ModalOpenAction<IdProp>).payload;
      return {
        ...state,
        activeModal: ModalType.EDIT_ACTIVITY,
        params,
      };
    }
    default: {
      return state;
    }
  }
}
