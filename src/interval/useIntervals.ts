import {IdType} from '../types';
import {Interval} from './IntervalElement';
import {useCallback, useMemo} from 'react';

interface IntervalsData {
  intervals: Interval[];
  getInterval: (intervalId: IdType) => Interval | null;
}

export function useIntervals(parentActivityId: IdType): IntervalsData {
  const startTimeEpochMilliseconds = useMemo(
    () => Date.now() - 1000 * 60 * 60 * 2,
    [],
  );
  const endTimeEpochMilliseconds = useMemo(
    () => startTimeEpochMilliseconds + 1000 * 60 * 60,
    [startTimeEpochMilliseconds],
  );
  const {intervals, intervalsMap} = useMemo(() => {
    if (!parentActivityId) {
      return {intervals: [], intervalsMap: new Map<IdType, Interval>()};
    }
    const generatedIntervals: Interval[] = [];
    for (let i = 3; i <= 2002; i++) {
      generatedIntervals.push({
        intervalId: i.toString(),
        parentActivityId,
        startTimeEpochMilliseconds,
        endTimeEpochMilliseconds,
      });
    }

    return {
      intervals: generatedIntervals,
      intervalsMap: new Map(
        generatedIntervals.map(interval => [interval.intervalId, interval]),
      ),
    };
  }, [parentActivityId, endTimeEpochMilliseconds, startTimeEpochMilliseconds]);
  const getInterval = useCallback(
    (intervalId: IdType) => intervalsMap.get(intervalId) ?? null,
    [intervalsMap],
  );
  return {
    intervals,
    getInterval,
  };
}
