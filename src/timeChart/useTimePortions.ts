import {useEffect, useState} from 'react';
import {IdType} from '../types';
import {Activity} from '../activity/ActivityElement';
import {TimeSpan} from '../time/types';
import useActivities from '../activity/useActivities';
import {useIntervals} from '../interval/useIntervals';
import {getDuration} from '../time/utils';
import {IntervalsRecord} from '../interval/redux/IntervalState';
import {getNonNullProjections} from '../utils/projections';
import {STANDARD_TICK_MS} from '../time/constants';
import * as TimeSpanTrim from './utils';
import {Interval} from '../interval/types';
import {useTranslation} from '../internationalization/useTranslation';

export interface TimePortion {
  totalTimeMilliseconds: number;
  percent: number;
  activity: Activity;
  trimmedIntervals: Interval[];
}

// Returns an interval with duration of zero (whereby start and end times are both zero) when the interval doesn't lie within the timespan
function trimIntervalWithTimeSpan(
  interval: Interval,
  timeSpan: TimeSpan,
): Interval {
  let trimmedInterval: Interval = {
    ...interval,
    startTimeEpochMilliseconds: 0,
    endTimeEpochMilliseconds: 0,
  };
  [
    TimeSpanTrim.handleTimeSpanOverlapCase1,
    TimeSpanTrim.handleTimeSpanOverlapCase2,
    TimeSpanTrim.handleTimeSpanOverlapCase3,
    TimeSpanTrim.handleTimeSpanOverlapCase4,
    TimeSpanTrim.handleTimeSpanOverlapCase5,
    TimeSpanTrim.handleTimeSpanOverlapCase6,
    TimeSpanTrim.handleTimeSpanOverlapCase7,
    TimeSpanTrim.handleTimeSpanOverlapCase8,
    TimeSpanTrim.handleTimeSpanOverlapCase9,
  ].forEach((handleCase: TimeSpanTrim.TimeSpanOverlapCaseHandler) => {
    const result: TimeSpanTrim.TimeSpanOverlapCaseResult = handleCase(
      interval,
      timeSpan,
    );
    if (result.wasCase) {
      trimmedInterval = {...trimmedInterval, ...result.trimmedTimeSpan};
    }
  });
  return trimmedInterval;
}

export type TimePortions = Map<IdType, TimePortion>;

export const defaultAnalyticsChartProps: TimePortions = new Map();

export function getTrimmedIntervalsWithinTimeSpan(
  intervals: Interval[],
  timeSpan: TimeSpan | null = null,
): Interval[] {
  if (timeSpan === null) {
    return intervals;
  }
  return intervals
    .map(interval => trimIntervalWithTimeSpan({...interval}, timeSpan))
    .filter(trimmedInterval => getDuration(trimmedInterval) > 0);
}

function calculateTimePortions(
  intervals: Interval[],
  getActivityById: (id: IdType) => Activity | null,
  timeSpan: TimeSpan,
  untrackedActivityLabel: string,
): TimePortions {
  const trimmedActivitiesIntervalsWithinTimeSpan: Map<IdType, IntervalsRecord> =
    new Map();
  getTrimmedIntervalsWithinTimeSpan(intervals, timeSpan).forEach(
    trimmedInterval => {
      const intervalsRecord: IntervalsRecord =
        trimmedActivitiesIntervalsWithinTimeSpan.get(
          trimmedInterval.parentActivityId,
        ) ?? new Map<IdType, Interval>();
      intervalsRecord.set(trimmedInterval.intervalId, trimmedInterval);
      trimmedActivitiesIntervalsWithinTimeSpan.set(
        trimmedInterval.parentActivityId,
        intervalsRecord,
      );
    },
  );
  const activitiesWithinTimeSpan = getNonNullProjections(
    [...trimmedActivitiesIntervalsWithinTimeSpan.keys()],
    getActivityById,
  );
  const totalTimeMilliseconds: number = getDuration(timeSpan);
  const timePortions: Map<IdType, TimePortion> = new Map(
    activitiesWithinTimeSpan.map(activity => {
      const trimmedIntervalsOfActivity = [
        ...(
          trimmedActivitiesIntervalsWithinTimeSpan.get(activity.id) ?? []
        )?.values(),
      ];
      const timePortion: TimePortion = {
        percent:
          (100 *
            trimmedIntervalsOfActivity.reduce(
              (
                totalActivityTrimmedDuration: number,
                interval: Interval,
              ): number => totalActivityTrimmedDuration + getDuration(interval),
              0,
            )) /
          totalTimeMilliseconds,
        activity,
        trimmedIntervals: trimmedIntervalsOfActivity,
        totalTimeMilliseconds,
      };
      return [activity.id, timePortion];
    }),
  );
  const totalTrackedTimeMilliseconds: number = [...timePortions.values()]
    .flatMap((timePortion: TimePortion) => timePortion.trimmedIntervals)
    .reduce(
      (acc: number, trimmedInterval: Interval) =>
        acc + getDuration(trimmedInterval),
      0,
    );
  timePortions.set('untracked', {
    percent: 100 * (1 - totalTrackedTimeMilliseconds / totalTimeMilliseconds),
    activity: {
      id: 'untracked',
      parentId: null,
      name: untrackedActivityLabel,
      currentlyActiveIntervalId: null,
      color: {red: 104, green: 104, blue: 104, alpha: 1},
    },
    trimmedIntervals: [],
    totalTimeMilliseconds,
  });
  return timePortions;
}

export function useTimePortions(timeSpan: TimeSpan): {
  totalTimeMilliseconds: number;
  timePortions: TimePortions;
} {
  const [timePortions, setTimePortions] = useState<TimePortions>(
    defaultAnalyticsChartProps,
  );
  const {getActivity} = useActivities();
  const {intervals} = useIntervals();
  const {translate} = useTranslation();
  useEffect(() => {
    const handle = setInterval(() => {
      setTimePortions(
        calculateTimePortions(
          intervals,
          getActivity,
          timeSpan,
          translate('Untracked-Time'),
        ),
      );
    }, STANDARD_TICK_MS);
    return () => {
      clearInterval(handle);
    };
  }, [getActivity, intervals, timeSpan, translate]);
  return {
    totalTimeMilliseconds: getDuration(timeSpan),
    timePortions,
  };
}
