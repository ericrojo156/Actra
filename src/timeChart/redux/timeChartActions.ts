import {TimeSpan} from '../../time/types';
import {BaseAction} from '../../types';

export const TIME_SPAN_CHANGED = 'TIME_SPAN_CHANGED';

export interface TimeSpanAction extends BaseAction {
  payload: TimeSpan;
}

export function timeSpanChanged(timeSpan: TimeSpan): TimeSpanAction {
  return {
    type: TIME_SPAN_CHANGED,
    payload: timeSpan,
  };
}
