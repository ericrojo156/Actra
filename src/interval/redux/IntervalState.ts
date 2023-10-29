import {IdType} from '../../types';
import {Interval} from '../types';

export type IntervalsRecord = Map<IdType, Interval>;

export interface IntervalState {
  currentlyActive: IdType;
  activitiesIntervals: Map<IdType, IntervalsRecord>;
}
