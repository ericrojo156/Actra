import {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {getDuration} from './utils';
import {STANDARD_TICK_MS} from './constants';
import {TimeSpan} from './types';

export function useRealTimeDuration(timeSpan: TimeSpan | null) {
  const [durationMilliseconds, setDurationMilliseconds] = useState(
    getDuration(timeSpan),
  );
  const recalculateDuration = useCallback(
    () => setDurationMilliseconds(getDuration(timeSpan)),
    [setDurationMilliseconds, timeSpan],
  );
  useEffect(() => {
    let cleanup = () => {};
    if (timeSpan?.endTimeEpochMilliseconds === null) {
      const handle = setInterval(() => {
        recalculateDuration();
      }, STANDARD_TICK_MS);
      cleanup = () => clearInterval(handle);
    }
    return () => {
      cleanup();
    };
  }, [timeSpan?.endTimeEpochMilliseconds, recalculateDuration]);
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
  return useRealTimeDuration(currentlyActiveInterval);
}
