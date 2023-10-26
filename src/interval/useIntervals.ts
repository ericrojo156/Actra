import {useSelector} from 'react-redux';
import {IdType} from '../types';
import {Interval} from './IntervalElement';
import {useCallback, useMemo} from 'react';
import {ApplicationState} from '../redux/rootReducer';
import {flatten} from '../utils/array';

interface IntervalsData {
  intervals: Interval[];
  getInterval: (intervalId: IdType) => Interval | null;
}

export function useMockIntervals(parentActivityId: IdType): IntervalsData {
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

function getDescendantIntervalsEntries(
  state: ApplicationState,
  parentActivityId?: IdType,
): [id: IdType, interval: Interval][] {
  if (typeof parentActivityId === 'undefined') {
    return getIntervalsEntries(state); // returns all the intervals in the store
  }
  return flatten(
    [
      ...(state.activity.activities
        .getDescendantsSet(parentActivityId)
        .values() ?? []),
    ].map(descendantId => [
      ...(state.interval.activitiesIntervals.get(descendantId)?.values() ?? []),
    ]) ?? [],
  ).map(interval => [interval.intervalId, interval]);
}

function getIntervalsEntries(
  state: ApplicationState,
  parentActivityId?: IdType,
): [id: IdType, interval: Interval][] {
  if (typeof parentActivityId === 'undefined') {
    return flatten(
      [...state.interval.activitiesIntervals.values()].map(intervalsRecord => [
        ...intervalsRecord.values(),
      ]),
    ).map(interval => [interval.intervalId, interval]);
  }
  return (
    [
      ...(state.interval.activitiesIntervals.get(parentActivityId)?.values() ??
        []),
    ].map(interval => [interval.intervalId, interval]) ?? []
  );
}

export function useIntervals(parentActivityId?: IdType) {
  const intervalsMap = useSelector((state: ApplicationState) => {
    const directIntervals: [id: IdType, interval: Interval][] =
      getIntervalsEntries(state, parentActivityId);
    const descendantsIntervals: [id: IdType, interval: Interval][] =
      getDescendantIntervalsEntries(state, parentActivityId);
    return new Map([...directIntervals, ...descendantsIntervals]);
  });
  const getInterval = useCallback(
    (id: IdType) => intervalsMap.get(id) ?? null,
    [intervalsMap],
  );
  const intervals = useMemo(() => [...intervalsMap.values()], [intervalsMap]);
  return {
    intervals,
    getInterval,
  };
}
