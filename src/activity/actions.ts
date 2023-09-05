import {BaseAction} from '../types';

export const DELETE_ACTIVITY_OPTION_INVOKED = 'DELETE_ACTIVITY_OPTION_INVOKED';
export const JOIN_ACTIVITY_OPTION_INVOKED = 'JOIN_ACTIVITY_OPTION_INVOKED';
export const EDIT_ACTIVITY_OPTION_INVOKED = 'EDIT_ACTIVITY_OPTION_INVOKED';
export const HISTORY_ACTIVITY_OPTION_INVOKED =
  'HISTORY_ACTIVITY_OPTION_INVOKED';
export const ADD_SUBACTIVITY_OPTION_INVOKED = 'ADD_SUBACTIVITY_OPTION_INVOKED';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';

export interface IdAction extends BaseAction {
  payload: string;
}

export function deleteActivityOptionInvoked(id: string): IdAction {
  return {
    type: DELETE_ACTIVITY_OPTION_INVOKED,
    payload: id,
  };
}

export function joinActivityOptionInvoked(id: string): IdAction {
  return {
    type: JOIN_ACTIVITY_OPTION_INVOKED,
    payload: id,
  };
}

export function editActivityOptionInvoked(id: string): IdAction {
  return {
    type: EDIT_ACTIVITY_OPTION_INVOKED,
    payload: id,
  };
}

export function historyActivityOptionInvoked(id: string): IdAction {
  return {
    type: HISTORY_ACTIVITY_OPTION_INVOKED,
    payload: id,
  };
}

export function addSubactivityOptionInvoked(id: string): IdAction {
  return {
    type: ADD_SUBACTIVITY_OPTION_INVOKED,
    payload: id,
  };
}

export function deleteActivity(id: string): IdAction {
  return {
    type: DELETE_ACTIVITY,
    payload: id,
  };
}
