import {useDispatch, useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {useCallback, useEffect, useState} from 'react';
import {TimeSpan} from '../time/types';
import {timeSpanChanged} from './redux/timeChartActions';
import {STANDARD_TICK_MS} from '../time/constants';
import {getDuration} from '../time/utils';

export function useTimeSpan() {
  const timeSpan: TimeSpan = useSelector(
    (state: ApplicationState) => state.timeChart.timeSpan,
  );
  const dispatch = useDispatch();
  const setTimeSpan = useCallback(
    (payload: TimeSpan): void => {
      dispatch(timeSpanChanged(payload));
    },
    [dispatch],
  );
  return {
    timeSpan,
    setTimeSpan,
  };
}

export function useTimeSpanRealTimeDurationMs() {
  const {timeSpan} = useTimeSpan();
  const [timeSpanDurationMs, setTimeSpanDisplayMs] = useState(
    getDuration(timeSpan),
  );
  useEffect(() => {
    const handle = setInterval(() => {
      setTimeSpanDisplayMs(getDuration(timeSpan));
    }, STANDARD_TICK_MS);
    return () => {
      clearInterval(handle);
    };
  }, [timeSpan]);
  return {
    timeSpanDurationMs,
  };
}
