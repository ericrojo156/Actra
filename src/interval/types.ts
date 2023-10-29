import {TimeSpan} from '../time/types';
import {IdType} from '../types';

export interface ActivityIntervalRelation {
  intervalId: IdType;
  parentActivityId: IdType;
}

export type Interval = ActivityIntervalRelation & TimeSpan;
