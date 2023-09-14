import {SelectionModalParams} from '../components/SelectionList';
import {BaseAction, IdProp} from '../types';

export const CLOSE_MODAL = 'CLOSE_MODAL';
export const JOIN_ACTIVITIES_OPENED = 'JOIN_ACTIVITIES_OPENED';
export const EDIT_ACTIVITY_OPENED = 'EDIT_ACTIVITY_OPENED';
export const ADD_SUBACTIVITIES_OPENED = 'ADD_SUBACTIVITIES_OPENED';

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

export function editActivityModalOpened(
  modalParams: ModalParams<IdProp>,
): ModalOpenAction<IdProp> {
  return {
    type: EDIT_ACTIVITY_OPENED,
    payload: modalParams,
  };
}

export function addSubactivitiesModalOpened(
  modalParams: ModalParams<SelectionModalParams>,
): ModalOpenAction<SelectionModalParams> {
  return {
    type: ADD_SUBACTIVITIES_OPENED,
    payload: modalParams,
  };
}
