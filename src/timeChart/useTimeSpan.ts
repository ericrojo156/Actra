import {useDispatch, useSelector} from 'react-redux';
import {ApplicationState} from '../redux/rootReducer';
import {useCallback} from 'react';
import {TimeSpan} from '../time/types';
import {timeSpanChanged} from './redux/timeChartActions';

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
