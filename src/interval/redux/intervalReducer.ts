import {produce} from 'immer';
import {
  DELETED_ACTIVITY,
  STARTED_ACTIVITY,
  STOPPED_ACTIVITY,
  TimerAction,
} from '../../activity/redux/activityActions';
import {BaseAction, IdType} from '../../types';
import {uuidv4} from '../../utils/uuid';
import {Interval} from '../IntervalElement';
import {IntervalState} from './IntervalState';
import {INTERVALS_LOADED, IntervalsAction} from './intervalsActions';
import {IdAction} from '../../redux/actions';

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

export default function intervalReducer(
  state: IntervalState = defaultIntervalState,
  action: BaseAction,
): IntervalState {
  switch (action.type) {
    case INTERVALS_LOADED: {
      const intervals = (action as IntervalsAction).payload;
      const nextState = produce(state, draft => {
        intervals.forEach(interval => {
          const activityRecord: Map<IdType, Interval> =
            draft.activitiesIntervals.get(interval.parentActivityId) ??
            new Map<IdType, Interval>();
          activityRecord.set(interval.intervalId, interval);
        });
      });
      return nextState;
    }
    case STARTED_ACTIVITY: {
      const {activityId: parentActivityId} = (action as TimerAction).payload;

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
    case STOPPED_ACTIVITY: {
      const {activityId: id, intervalId: currentlyActiveIntervalId} = (
        action as TimerAction
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
      });
      return nextState;
    }
    case DELETED_ACTIVITY: {
      const deletedActivitiyId: IdType = (action as IdAction).payload;
      const nextState = produce(state, draft => {
        draft.activitiesIntervals.delete(deletedActivitiyId);
      });
      return nextState;
    }
    default: {
      return state;
    }
  }
}
