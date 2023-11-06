import {produce} from 'immer';
import {BaseAction} from '../../types';
import {TIME_SPAN_CHANGED, TimeSpanAction} from './timeChartActions';
import {TimeChartState} from './timeChartState';
import {getTimeSpanSincePrevious6AM} from '../../time/utils';

const defaultTimeChartState: TimeChartState = {
  timeSpan: getTimeSpanSincePrevious6AM(),
};

export function timeChartReducer(
  state: TimeChartState = defaultTimeChartState,
  action: BaseAction,
) {
  switch (action.type) {
    case TIME_SPAN_CHANGED: {
      return produce(state, draft => {
        const {startTimeEpochMilliseconds, endTimeEpochMilliseconds} = (
          action as TimeSpanAction
        ).payload;
        draft.timeSpan.startTimeEpochMilliseconds = startTimeEpochMilliseconds;
        draft.timeSpan.endTimeEpochMilliseconds = endTimeEpochMilliseconds;
      });
    }
    default: {
      return state;
    }
  }
}
