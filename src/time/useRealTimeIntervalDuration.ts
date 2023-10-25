import {useState, useCallback, useEffect} from 'react';
import {Interval} from '../interval/IntervalElement';
import {useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';

function calcDuration(interval: Interval | null): number {
  if (interval === null) {
    return 0;
  }
  return (
    (interval?.endTimeEpochMilliseconds ?? Date.now()) -
    (interval?.startTimeEpochMilliseconds ?? Date.now())
  );
}

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
      }, 100);
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
