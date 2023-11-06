import {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {getDuration} from './utils';
import {STANDARD_TICK_MS} from './constants';
import {Interval} from '../interval/types';

export function useIntervalRealTimeDuration(interval: Interval | null) {
  const [durationMilliseconds, setDurationMilliseconds] = useState(
    getDuration(interval),
  );
  const recalculateDuration = useCallback(
    () => setDurationMilliseconds(getDuration(interval)),
    [setDurationMilliseconds, interval],
  );
  useEffect(() => {
    let cleanup = () => {};
    if (interval?.endTimeEpochMilliseconds === null) {
      const handle = setInterval(() => {
        recalculateDuration();
      }, STANDARD_TICK_MS);
      cleanup = () => clearInterval(handle);
    }
    return () => {
      cleanup();
    };
  }, [
    interval?.endTimeEpochMilliseconds,
    interval?.intervalId,
    recalculateDuration,
  ]);
  return durationMilliseconds;
}

export function useCurrentIntervalRealTimeDuration() {
  const currentlyActiveActivityId = useSelector(
    (state: ApplicationState) => state.activity.currentlyActive,
  );
  const currentlyActiveInterval = useSelector((state: ApplicationState) => {
    const currentlyActiveIntervalId = state.interval.currentlyActive;
    return (
      state.interval.activitiesIntervals
        .get(currentlyActiveActivityId)
        ?.get(currentlyActiveIntervalId) ?? null
    );
  });
  return useIntervalRealTimeDuration(currentlyActiveInterval);
}
