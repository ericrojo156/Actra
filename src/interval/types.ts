import {IdType} from '../types';

export interface ActivityIntervalRelation {
  intervalId: IdType;
  parentActivityId: IdType;
}

export interface Interval extends ActivityIntervalRelation {
  startTimeEpochMilliseconds: number;
  endTimeEpochMilliseconds: number | null;
}
