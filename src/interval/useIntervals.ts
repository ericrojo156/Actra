// import {useSelector} from 'react-redux';
// import {ApplicationState} from '../redux/rootReducer';
import {uuidv4} from '../utils/uuid';
import {Interval} from './IntervalElement';
import {useMemo} from 'react';

interface IntervalsData {
  intervals: Interval[];
}

export function useIntervals(_parentActivityId: string): IntervalsData {
  //   const intervals: Interval[] = useSelector((state: ApplicationState) => [
  //     ...state.interval.intervals.values(),
  //   ]);
  const intervals = useMemo(
    () => [
      {
        intervalId: uuidv4(),
        parentActivityId: _parentActivityId,
        startTimeEpochSeconds: Date.now() / 1000 - 120 * 60 * 60,
        endTimeEpochSeconds: 60 * 60 + Date.now() / 1000 - 120 * 60 * 60,
      },
    ],
    [_parentActivityId],
  );
  return {
    intervals,
  };
}
