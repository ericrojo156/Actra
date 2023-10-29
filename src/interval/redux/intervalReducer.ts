import {produce} from 'immer';
import {
  DELETED_ACTIVITY,
  START_ACTIVITY,
  STOP_ACTIVITY,
  DELETED_ACTIVITIES,
  SET_CURRENTLY_ACTIVE,
} from '../../activity/redux/activityActions';
import {BaseAction, IdType} from '../../types';
import {uuidv4} from '../../utils/uuid';
import {IntervalState} from './IntervalState';
import {
  DELETE_INTERVAL,
  LOADED_INTERVALS,
  IntervalsAction,
  JOIN_INTERVALS_TO_ACTIVITY,
  JoinActivitiesAction,
  UNDO_INTERVAL_DELETION,
  IntervalAction,
  DeletedIntervalAction,
  EDIT_INTERVAL,
} from './intervalsActions';
import {CurrentlyActiveAction, IdAction, IdsAction} from '../../redux/actions';
import {flatten} from '../../utils/array';
import {Interval} from '../types';

const defaultIntervalState: IntervalState = {
  currentlyActive: null,
  activitiesIntervals: new Map(),
};

function createIntervalStartingNow(parentActivityId: IdType): Interval {
  return {
    intervalId: uuidv4(),
    parentActivityId,
    startTimeEpochMilliseconds: Date.now(),
    endTimeEpochMilliseconds: null,
  };
}

function deleteIntervalsOfActivityFromState(
  state: IntervalState,
  deletedActivityId: IdType,
) {
  const nextState = produce(state, draft => {
    const currentlyActiveIntervalId = state.currentlyActive;
    const intervalsOfDeletedActivity: Interval[] = [
      ...(state.activitiesIntervals.get(deletedActivityId)?.values() ?? []),
    ];
    if (
      !intervalsOfDeletedActivity.every(
        (interval: Interval) =>
          currentlyActiveIntervalId !== (interval?.intervalId ?? null),
      )
    ) {
      draft.currentlyActive = null;
    }
    draft.activitiesIntervals.delete(deletedActivityId);
  });
  return nextState;
}

export default function intervalReducer(
  state: IntervalState = defaultIntervalState,
  action: BaseAction,
): IntervalState {
  switch (action.type) {
    case LOADED_INTERVALS: {
      const intervals = (action as IntervalsAction).payload;
      const nextState = produce(state, draft => {
        intervals.forEach(interval => {
          const activityRecord: Map<IdType, Interval> =
            state.activitiesIntervals.get(interval.parentActivityId) ??
            new Map<IdType, Interval>();
          activityRecord.set(interval.intervalId, interval);
          draft.activitiesIntervals.set(
            interval.parentActivityId,
            activityRecord,
          );
        });
      });
      return nextState;
    }
    case START_ACTIVITY: {
      const parentActivityId = (action as IdAction).payload;
      const nextState = produce(state, draft => {
        const intervals =
          draft.activitiesIntervals.get(parentActivityId) ?? new Map();
        const newInterval: Interval =
          createIntervalStartingNow(parentActivityId);
        intervals.set(newInterval.intervalId, newInterval);
        draft.activitiesIntervals.set(parentActivityId, intervals);
        draft.currentlyActive = newInterval.intervalId;
      });
      return nextState;
    }
    case STOP_ACTIVITY: {
      const {parentActivityId: id, intervalId: currentlyActiveIntervalId} = (
        action as IntervalAction
      ).payload;
      const nextState = produce(state, draft => {
        const intervals = draft.activitiesIntervals.get(id) ?? new Map();
        const currentInterval =
          intervals.get(currentlyActiveIntervalId) ?? null;
        if (!currentInterval) {
          return state;
        }
        currentInterval.endTimeEpochMilliseconds = Date.now();
        intervals.set(currentlyActiveIntervalId, currentInterval);
        draft.activitiesIntervals.set(id, intervals);
        draft.currentlyActive = null;
      });
      return nextState;
    }
    case DELETED_ACTIVITY: {
      const deletedActivitiyId: IdType = (action as IdAction).payload;
      return deleteIntervalsOfActivityFromState(state, deletedActivitiyId);
    }
    case DELETED_ACTIVITIES: {
      const activityIds = (action as IdsAction).payload;
      const nextState = activityIds.reduce(
        (accState: IntervalState, deletedActivityId: IdType): IntervalState =>
          deleteIntervalsOfActivityFromState(accState, deletedActivityId),
        state,
      );
      return nextState;
    }
    case SET_CURRENTLY_ACTIVE: {
      const {intervalId} = (action as CurrentlyActiveAction).payload;
      return {
        ...state,
        currentlyActive: intervalId,
      };
    }
    case JOIN_INTERVALS_TO_ACTIVITY: {
      const {combinedActivityId, activitiesToJoin} = (
        action as JoinActivitiesAction
      ).payload;
      const nextState = produce(state, draft => {
        const combinedIntervals: Interval[] = flatten(
          activitiesToJoin.map(id => [
            ...(state.activitiesIntervals.get(id)?.values() ?? []),
          ]),
        );
        const combinedIntervalsMap = new Map(
          combinedIntervals.map(interval => [interval.intervalId, interval]),
        );
        draft.activitiesIntervals.set(combinedActivityId, combinedIntervalsMap);
      });
      return nextState;
    }
    case DELETE_INTERVAL: {
      const {deletedInterval, wasActive} = (action as DeletedIntervalAction)
        .payload;
      return produce(state, draft => {
        const intervals = draft.activitiesIntervals.get(
          deletedInterval.parentActivityId,
        );
        if (!intervals) {
          return;
        }
        if (wasActive) {
          draft.currentlyActive = null;
        }
        intervals.delete(deletedInterval.intervalId);
      });
    }
    case UNDO_INTERVAL_DELETION: {
      const {deletedInterval, wasActive} = (action as DeletedIntervalAction)
        .payload;
      return produce(state, draft => {
        const parentActivityId = deletedInterval?.parentActivityId ?? null;
        if (wasActive) {
          draft.currentlyActive = deletedInterval.intervalId;
        }
        const intervals =
          draft.activitiesIntervals.get(parentActivityId) ?? new Map();
        const newInterval: Interval = {
          ...deletedInterval,
        };
        intervals.set(newInterval.intervalId, newInterval);
        draft.activitiesIntervals.set(parentActivityId, intervals);
      });
    }
    case EDIT_INTERVAL: {
      const updatedInterval = (action as IntervalAction).payload;
      return produce(state, draft => {
        draft.activitiesIntervals
          .get(updatedInterval.parentActivityId)
          ?.set(updatedInterval.intervalId, {...updatedInterval});
      });
    }
    default: {
      return state;
    }
  }
}
