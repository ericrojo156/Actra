// import {useSelector} from 'react-redux';
// import {ApplicationState} from '../redux/rootReducer';
import {Interval} from './IntervalElement';
import {useCallback, useMemo} from 'react';

interface IntervalsData {
  intervals: Interval[];
  getInterval: (intervalId: string) => Interval | null;
}

export function useIntervals(_parentActivityId: string): IntervalsData {
  //   const intervals: Interval[] = useSelector((state: ApplicationState) => [
  //     ...state.interval.intervals.values(),
  //   ]);
  const startTimeEpochSeconds = Date.now() / 1000 - 60 * 60 * 2;
  const endTimeEpochSeconds = startTimeEpochSeconds + 10 * 25 * 60 * 59 + 59;
  const intervals = useMemo(
    () => [
      {
        intervalId: '1',
        parentActivityId: _parentActivityId,
        startTimeEpochSeconds,
        endTimeEpochSeconds,
      },
      {
        intervalId: '2',
        parentActivityId: _parentActivityId,
        startTimeEpochSeconds: Date.now() / 1000 - 120 * 60 * 60,
        endTimeEpochSeconds: 60 * 60 + Date.now() / 1000 - 120 * 60 * 60,
      },
    ],
    [_parentActivityId, endTimeEpochSeconds, startTimeEpochSeconds],
  );
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
