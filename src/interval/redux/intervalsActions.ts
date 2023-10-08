import {IntervalAction} from '../../activity/redux/activityActions';
import {BaseAction, IdType} from '../../types';
import {Interval} from '../IntervalElement';

export const INTERVALS_LOADED = 'INTERVALS_LOADED';
export const JOIN_INTERVALS_TO_ACTIVITY = 'JOIN_INTERVALS_TO_ACTIVITY';
export const DELETE_INTERVAL = 'DELETE_INTERVAL';

export interface IntervalsAction extends BaseAction {
  payload: Interval[];
}

export interface JoinActivitiesAction extends BaseAction {
  payload: {combinedActivityId: IdType; activitiesToJoin: IdType[]};
}

export function intervalsLoaded(intervals: Interval[]): IntervalsAction {
  return {
    type: INTERVALS_LOADED,
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

export function deleteInterval(
  activityId: IdType,
  intervalId: IdType,
): IntervalAction {
  return {
    type: DELETE_INTERVAL,
    payload: {
      activityId,
      intervalId,
    },
  };
}
