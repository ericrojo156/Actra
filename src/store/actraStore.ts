import {Activity} from '../activity/ActivityElement';
import {Interval} from '../interval/types';
import {ACTRA_VERSION, CurrentlyActive, IActraStore} from './IActraStore';

export function createActraStore(
  activities: Activity[],
  intervals: Interval[],
  currentlyActive: CurrentlyActive,
): IActraStore {
  return {
    version: ACTRA_VERSION,
    data: {activities, intervals, currentlyActive},
  };
}
