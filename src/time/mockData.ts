import {TimeSpan} from './types';

// for development purposes
export const oneHourTimeSpan = {
  startTimeEpochMilliseconds: Date.now() - 60 * 60 * 1000,
  endTimeEpochMilliseconds: null,
};

export function getTimeSpanFromDurationUntilNow(durationMs: number): TimeSpan {
  return {
    startTimeEpochMilliseconds: Date.now() - durationMs,
    endTimeEpochMilliseconds: null,
  };
}
