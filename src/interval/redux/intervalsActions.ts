import {BaseAction} from '../../types';
import {Interval} from '../IntervalElement';

export const INTERVALS_LOADED = 'INTERVALS_LOADED';

export interface IntervalsAction extends BaseAction {
  payload: Interval[];
}

export function intervalsLoaded(intervals: Interval[]): IntervalsAction {
  return {
    type: INTERVALS_LOADED,
    payload: intervals,
  };
}
