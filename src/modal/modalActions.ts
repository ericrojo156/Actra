import {SelectionModalParams} from '../components/SelectionList';
import {BaseAction} from '../types';

export const CLOSE_MODAL = 'CLOSE_MODAL';
export const JOIN_ACTIVITIES_OPENED = 'JOIN_ACTIVITIES_OPENED';

export interface ModalParams<T> {
  params: T;
}

export interface ModalOpenAction<T> extends BaseAction {
  payload: ModalParams<T>;
}

export function modalClosed(): BaseAction {
  return {
    type: CLOSE_MODAL,
  };
}

export function joinActivitiesModalOpened(
  modalParams: ModalParams<SelectionModalParams>,
): ModalOpenAction<SelectionModalParams> {
  return {
    type: JOIN_ACTIVITIES_OPENED,
    payload: modalParams,
  };
}
