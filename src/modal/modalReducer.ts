import {
  CreateSubactivityParams,
  SelectionModalParams,
} from '../components/SelectionList';
import {BaseAction, IdProp} from '../types';

import ModalState from './ModalState';
import {
  ADD_SUBACTIVITIES_OPENED,
  CLOSE_MODAL,
  CREATE_ACTIVITY_OPENED,
  EDIT_ACTIVITY_OPENED,
  JOIN_ACTIVITIES_OPENED,
  ModalOpenAction,
} from './modalActions';

export const enum ModalType {
  CREATE_ACTIVITY,
  EDIT_ACTIVITY,
  ADD_SUBACTIVITIES,
  JOIN_ACTIVITIES,
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
    case ADD_SUBACTIVITIES_OPENED: {
      const {params} = (action as ModalOpenAction<SelectionModalParams>)
        .payload;
      return {
        ...state,
        activeModal: ModalType.ADD_SUBACTIVITIES,
        params,
      };
    }
    case CREATE_ACTIVITY_OPENED: {
      const {params} = (action as ModalOpenAction<CreateSubactivityParams>)
        .payload;
      return {
        ...state,
        activeModal: ModalType.CREATE_ACTIVITY,
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
