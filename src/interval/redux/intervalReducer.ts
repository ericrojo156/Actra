import {BaseAction} from '../../types';
import {Interval} from '../IntervalElement';
import {IntervalState} from './IntervalState';
import {INTERVALS_LOADED, IntervalsAction} from './intervalsActions';

const defaultIntervalState: IntervalState = {
  intervals: new Map(),
};

export default function intervalReducer(
  state: IntervalState = defaultIntervalState,
  action: BaseAction,
) {
  switch (action.type) {
    case INTERVALS_LOADED: {
      const intervals = (action as IntervalsAction).payload;
      return {
        ...state,
        intervals: new Map(
          intervals.map((interval: Interval) => [
            interval.intervalId,
            interval,
          ]),
        ),
      };
    }
    default: {
      return state;
    }
  }
}
