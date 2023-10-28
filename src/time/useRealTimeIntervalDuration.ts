import {useState, useCallback, useEffect} from 'react';
import {Interval} from '../interval/IntervalElement';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {calcDuration} from './utils';
import {STANDARD_TICK_MS} from './constants';

export function useIntervalRealTimeDuration(interval: Interval | null) {
  const [durationMilliseconds, setDurationMilliseconds] = useState(
    calcDuration(interval),
  );
  const recalculateDuration = useCallback(
    () => setDurationMilliseconds(calcDuration(interval)),
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
