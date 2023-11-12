import {BaseAction, IdType} from '../../types';
import {Interval} from '../types';
import {TimeSpan} from '../../time/types';

export const LOADED_INTERVALS = 'LOADED_INTERVALS';
export const JOIN_INTERVALS_TO_ACTIVITY_REQUESTED =
  'JOIN_INTERVALS_TO_ACTIVITY_REQUESTED';
export const DELETE_INTERVAL_REQUESTED = 'DELETE_INTERVAL_REQUESTED';
export const UNDO_INTERVAL_DELETION_REQUESTED =
  'UNDO_INTERVAL_DELETION_REQUESTED';
export const EDIT_INTERVAL_REQUESTED = 'EDIT_INTERVAL_REQUESTED';

export const JOIN_INTERVALS_TO_ACTIVITY = 'JOIN_INTERVALS_TO_ACTIVITY';
export const DELETE_INTERVAL = 'DELETE_INTERVAL';
export const UNDO_INTERVAL_DELETION = 'UNDO_INTERVAL_DELETION';
export const EDIT_INTERVAL = 'EDIT_INTERVAL';

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

function joinIntervalsToActivityRequested(
  combinedActivityId: IdType,
  activitiesToJoin: IdType[],
): JoinActivitiesAction {
  return {
    type: JOIN_INTERVALS_TO_ACTIVITY_REQUESTED,
    payload: {
      combinedActivityId,
      activitiesToJoin,
    },
  };
}

function deleteIntervalRequested(
  deletedInterval: Interval,
  wasActive: boolean,
): DeletedIntervalAction {
  return {
    type: DELETE_INTERVAL_REQUESTED,
    payload: {
      deletedInterval,
      wasActive,
    },
  };
}

function undoDeleteIntervalRequested(
  deletedInterval: Interval,
  wasActive: boolean,
): DeletedIntervalAction {
  return {
    type: UNDO_INTERVAL_DELETION_REQUESTED,
    payload: {
      deletedInterval,
      wasActive,
    },
  };
}

function editIntervalRequested(interval: Interval): IntervalAction {
  return {
    type: EDIT_INTERVAL_REQUESTED,
    payload: interval,
  };
}

function joinIntervalsToActivity(
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

function deleteInterval(
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

function undoDeleteInterval(
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

function editInterval(interval: Interval): IntervalAction {
  return {
    type: EDIT_INTERVAL,
    payload: interval,
  };
}

export default {
  joinIntervalsToActivity: {
    request: joinIntervalsToActivityRequested,
    action: joinIntervalsToActivity,
  },
  deleteInterval: {
    request: deleteIntervalRequested,
    action: deleteInterval,
  },
  undoDeleteInterval: {
    request: undoDeleteIntervalRequested,
    action: undoDeleteInterval,
  },
  editInterval: {
    request: editIntervalRequested,
    action: editInterval,
  },
};
