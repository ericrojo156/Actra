import {Interval} from './IntervalElement';
import {useCallback, useMemo} from 'react';

interface IntervalsData {
  intervals: Interval[];
  getInterval: (intervalId: string) => Interval | null;
}

export function useIntervals(parentActivityId: string): IntervalsData {
  const startTimeEpochSeconds = useMemo(
    () => Date.now() / 1000 - 60 * 60 * 2,
    [],
  );
  const endTimeEpochSeconds = useMemo(
    () => startTimeEpochSeconds + 10 * 25 * 60 * 59 + 59,
    [startTimeEpochSeconds],
  );
  const intervals = useMemo(() => {
    const generatedIntervals = [];
    for (let i = 3; i <= 302; i++) {
      generatedIntervals.push({
        intervalId: i.toString(),
        parentActivityId,
        startTimeEpochSeconds,
        endTimeEpochSeconds,
      });
    }
    return generatedIntervals;
  }, [parentActivityId, endTimeEpochSeconds, startTimeEpochSeconds]);
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
