import {Interval} from './IntervalElement';
import {useCallback, useMemo} from 'react';

interface IntervalsData {
  intervals: Interval[];
  getInterval: (intervalId: string) => Interval | null;
}

export function useIntervals(parentActivityId: string): IntervalsData {
  const startTimeEpochMilliseconds = useMemo(
    () => Date.now() - 1000 * 60 * 60 * 2,
    [],
  );
  const endTimeEpochMilliseconds = useMemo(
    () => startTimeEpochMilliseconds + 1000 * 60 * 60,
    [startTimeEpochMilliseconds],
  );
  const intervals = useMemo(() => {
    const generatedIntervals = [];
    for (let i = 3; i <= 2002; i++) {
      generatedIntervals.push({
        intervalId: i.toString(),
        parentActivityId,
        startTimeEpochMilliseconds,
        endTimeEpochMilliseconds,
      });
    }
    return generatedIntervals;
  }, [parentActivityId, endTimeEpochMilliseconds, startTimeEpochMilliseconds]);
  const getInterval = useCallback(
    (intervalId: string) =>
      intervals.find(interval => interval.intervalId === intervalId) ?? null,
    [intervals],
  );
  return {
    intervals,
    getInterval,
  };
}
