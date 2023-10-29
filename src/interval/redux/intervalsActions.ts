import {BaseAction, IdType} from '../../types';
import {Interval} from '../types';
import {TimeSpan} from '../../time/types';

export const LOADED_INTERVALS = 'LOADED_INTERVALS';
export const JOIN_INTERVALS_TO_ACTIVITY = 'JOIN_INTERVALS_TO_ACTIVITY';
export const DELETE_INTERVAL = 'DELETE_INTERVAL';
export const UNDO_INTERVAL_DELETION = 'UNDO_INTERVAL_DELETION';
export const EDITED_INTERVAL = 'EDITED_INTERVAL';

export interface DeletedIntervalAction extends BaseAction {
  payload: {
    deletedInterval: Interval;
    wasActive: boolean;
  };
}

export interface IntervalAction extends BaseAction {
  payload: Interval;
}

export interface IntervalsAction extends BaseAction {
  payload: Interval[];
}

export interface TimeSpanAction extends BaseAction {
  payload: TimeSpan;
}

export interface JoinActivitiesAction extends BaseAction {
  payload: {combinedActivityId: IdType; activitiesToJoin: IdType[]};
}

export function loadedIntervals(intervals: Interval[]): IntervalsAction {
  return {
    type: LOADED_INTERVALS,
    payload: intervals,
  };
}

export function joinIntervalsToActivity(
  combinedActivityId: IdType,
  activitiesToJoin: IdType[],
): JoinActivitiesAction {
  return {
    type: JOIN_INTERVALS_TO_ACTIVITY,
    payload: {
      combinedActivityId,
      activitiesToJoin,
    },
  };
}

export function deletedInterval(
  deletedInterval: Interval,
  wasActive: boolean,
): DeletedIntervalAction {
  return {
    type: DELETE_INTERVAL,
    payload: {
      deletedInterval,
      wasActive,
    },
  };
}

export function undoDeletedInterval(
  deletedInterval: Interval,
  wasActive: boolean,
): DeletedIntervalAction {
  return {
    type: UNDO_INTERVAL_DELETION,
    payload: {
      deletedInterval,
      wasActive,
    },
  };
}

export function editedInterval(interval: Interval): IntervalAction {
  return {
    type: EDITED_INTERVAL,
    payload: interval,
  };
}
