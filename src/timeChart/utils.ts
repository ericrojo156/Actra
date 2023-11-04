import {TimeSpan} from '../time/types';

export interface TimeSpanOverlapCaseResult {
  wasCase: boolean;
  trimmedTimeSpan: TimeSpan;
}

export type TimeSpanOverlapCaseHandler = (
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
) => TimeSpanOverlapCaseResult;

/*
...............case 1......................
    <------timeSpan1------>
        <------timeSpan2----->
*/
export function handleTimeSpanOverlapCase1(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    timeSpan1.startTimeEpochMilliseconds <
      timeSpan2.startTimeEpochMilliseconds &&
    (timeSpan1.endTimeEpochMilliseconds ?? Date.now()) <
      (timeSpan2.endTimeEpochMilliseconds ?? Date.now())
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.startTimeEpochMilliseconds =
      timeSpan2.startTimeEpochMilliseconds;
  }
  return result;
}

/*
...............case 2......................
        <------timeSpan1------>
    <------timeSpan2----->
*/
export function handleTimeSpanOverlapCase2(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    timeSpan2.startTimeEpochMilliseconds <
      timeSpan1.startTimeEpochMilliseconds &&
    (timeSpan2.endTimeEpochMilliseconds ?? Date.now()) <
      (timeSpan1.endTimeEpochMilliseconds ?? Date.now())
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.endTimeEpochMilliseconds =
      timeSpan2.endTimeEpochMilliseconds ?? Date.now();
  }
  return result;
}

/*
...............case 3......................
                            <------timeSpan1------>
    <------timeSpan2----->

*/
export function handleTimeSpanOverlapCase3(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    (timeSpan2.endTimeEpochMilliseconds ?? Date.now()) <
    timeSpan1.startTimeEpochMilliseconds
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.startTimeEpochMilliseconds = 0;
    result.trimmedTimeSpan.endTimeEpochMilliseconds = 0;
  }
  return result;
}

/*
...............case 4......................
    <------timeSpan1------>
                            <------timeSpan2----->
*/
export function handleTimeSpanOverlapCase4(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    (timeSpan1.endTimeEpochMilliseconds ?? Date.now()) <
    timeSpan2.startTimeEpochMilliseconds
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.startTimeEpochMilliseconds = 0;
    result.trimmedTimeSpan.endTimeEpochMilliseconds = 0;
  }
  return result;
}

/*
...............case 5......................
        <------timeSpan1------>
    <----------timeSpan2-------------->
*/
export function handleTimeSpanOverlapCase5(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    timeSpan2.startTimeEpochMilliseconds <
      timeSpan1.startTimeEpochMilliseconds &&
    (timeSpan1.endTimeEpochMilliseconds ?? Date.now()) <
      (timeSpan2.endTimeEpochMilliseconds ?? Date.now())
  ) {
    result.wasCase = true;
  }
  return result;
}

/*
...............case 6......................
    <------------timeSpan1------------->
        <------timeSpan2----->
*/
export function handleTimeSpanOverlapCase6(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    timeSpan1.startTimeEpochMilliseconds <
      timeSpan2.startTimeEpochMilliseconds &&
    (timeSpan2.endTimeEpochMilliseconds ?? Date.now()) <
      (timeSpan1.endTimeEpochMilliseconds ?? Date.now())
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.startTimeEpochMilliseconds =
      timeSpan2.startTimeEpochMilliseconds;
    result.trimmedTimeSpan.endTimeEpochMilliseconds =
      timeSpan2.endTimeEpochMilliseconds ?? Date.now();
  }
  return result;
}
