import {Activity} from '../activity/ActivityElement';
import {Interval} from '../interval/IntervalElement';
import {IdType} from '../types';

export const ACTRA_VERSION = '1.0';

export interface CurrentlyActive {
  activityId: IdType;
  intervalId: IdType;
}

export interface IActraStore {
  version: string;
  data: {
    activities: Activity[];
    intervals: Interval[];
    currentlyActive: CurrentlyActive;
  };
}
