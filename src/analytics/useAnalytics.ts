import {useEffect, useState} from 'react';
import {IdType} from '../types';
import {Activity} from '../activity/ActivityElement';
import {TimeSpan} from '../time/types';
import useActivities from '../activity/useActivities';
import {useIntervals} from '../interval/useIntervals';
import {calcDuration} from '../time/utils';
import {IntervalsRecord} from '../interval/redux/IntervalState';
import {getNonNullProjections} from '../utils/projections';
import {STANDARD_TICK_MS} from '../time/constants';
import * as TimeSpanTrim from './timeSpanTrim';
import {Interval} from '../interval/types';

export interface TimePortion {
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

export interface AnalyticsChartProps {
  totalTimeMilliseconds: number;
  timePortionsMap: Map<IdType, TimePortion>;
}

export const defaultAnalyticsChartProps: AnalyticsChartProps = {
  totalTimeMilliseconds: 0,
  timePortionsMap: new Map(),
};

function calculateAnalyticsChartProps(
  intervals: Interval[],
  getActivityById: (id: IdType) => Activity | null,
  timeSpan: TimeSpan,
): AnalyticsChartProps {
  const trimmedActivitiesIntervalsWithinTimeSpan: Map<IdType, IntervalsRecord> =
    new Map();
  intervals
    .map(interval => trimIntervalWithTimeSpan({...interval}, timeSpan))
    .filter(trimmedInterval => calcDuration(trimmedInterval) > 0)
    .forEach(trimmedInterval => {
      const intervalsRecord: IntervalsRecord =
        trimmedActivitiesIntervalsWithinTimeSpan.get(
          trimmedInterval.parentActivityId,
        ) ?? new Map<IdType, Interval>();
      intervalsRecord.set(trimmedInterval.intervalId, trimmedInterval);
      trimmedActivitiesIntervalsWithinTimeSpan.set(
        trimmedInterval.parentActivityId,
        intervalsRecord,
      );
    });
  const activitiesWithinTimeSpan = getNonNullProjections(
    [...trimmedActivitiesIntervalsWithinTimeSpan.keys()],
    getActivityById,
  );
  const totalTimeMilliseconds: number =
    (timeSpan.endTimeEpochMilliseconds ?? Date.now()) -
    timeSpan.startTimeEpochMilliseconds;

  const timePortionsMap: Map<IdType, TimePortion> = new Map(
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
              ): number =>
                totalActivityTrimmedDuration + calcDuration(interval),
              0,
            )) /
          totalTimeMilliseconds,
        activity,
        trimmedIntervals: trimmedIntervalsOfActivity,
      };
      return [activity.id, timePortion];
    }),
  );
  return {totalTimeMilliseconds, timePortionsMap};
}

export function useAnalytics(timeSpan: TimeSpan): {
  analyticsChartProps: AnalyticsChartProps;
} {
  const [analyticsChartProps, setAnalyticsChartProps] =
    useState<AnalyticsChartProps>(defaultAnalyticsChartProps);
  const {getActivity} = useActivities();
  const {intervals} = useIntervals();
  useEffect(() => {
    const handle = setInterval(() => {
      setAnalyticsChartProps(
        calculateAnalyticsChartProps(intervals, getActivity, timeSpan),
      );
    }, STANDARD_TICK_MS);
    return () => {
      clearInterval(handle);
    };
  }, [getActivity, intervals, timeSpan]);
  return {
    analyticsChartProps,
  };
}
