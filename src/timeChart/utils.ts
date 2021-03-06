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
  const dateNow = Date.now();
  if (
    timeSpan1.startTimeEpochMilliseconds <
      timeSpan2.startTimeEpochMilliseconds &&
    (timeSpan1.endTimeEpochMilliseconds ?? dateNow) <
      (timeSpan2.endTimeEpochMilliseconds ?? dateNow)
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
  const dateNow = Date.now();
  if (
    timeSpan2.startTimeEpochMilliseconds <
      timeSpan1.startTimeEpochMilliseconds &&
    (timeSpan2.endTimeEpochMilliseconds ?? dateNow) <
      (timeSpan1.endTimeEpochMilliseconds ?? dateNow)
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.endTimeEpochMilliseconds =
      timeSpan2.endTimeEpochMilliseconds ?? dateNow;
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
  const dateNow = Date.now();
  if (
    (timeSpan2.endTimeEpochMilliseconds ?? dateNow) <
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
  const dateNow = Date.now();
  if (
    (timeSpan1.endTimeEpochMilliseconds ?? dateNow) <
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
  const dateNow = Date.now();
  if (
    timeSpan2.startTimeEpochMilliseconds <
      timeSpan1.startTimeEpochMilliseconds &&
    (timeSpan1.endTimeEpochMilliseconds ?? dateNow) <
      (timeSpan2.endTimeEpochMilliseconds ?? dateNow)
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
  const dateNow = Date.now();
  if (
    timeSpan1.startTimeEpochMilliseconds <
      timeSpan2.startTimeEpochMilliseconds &&
    (timeSpan2.endTimeEpochMilliseconds ?? dateNow) <
      (timeSpan1.endTimeEpochMilliseconds ?? dateNow)
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.startTimeEpochMilliseconds =
      timeSpan2.startTimeEpochMilliseconds;
    result.trimmedTimeSpan.endTimeEpochMilliseconds =
      timeSpan2.endTimeEpochMilliseconds;
  }
  return result;
}

/*
...............case 7......................
    <------------timeSpan1-------------now
        <------timeSpan2---------------now
*/
export function handleTimeSpanOverlapCase7(
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
    timeSpan1.endTimeEpochMilliseconds === null &&
    timeSpan2.endTimeEpochMilliseconds === null
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.startTimeEpochMilliseconds =
      timeSpan2.startTimeEpochMilliseconds;
    result.trimmedTimeSpan.endTimeEpochMilliseconds = null;
  }
  return result;
}

/*
...............case 8......................
        <--------timeSpan1-------------now
    <----------timeSpan2---------------now
*/
export function handleTimeSpanOverlapCase8(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    timeSpan1.startTimeEpochMilliseconds >
      timeSpan2.startTimeEpochMilliseconds &&
    timeSpan1.endTimeEpochMilliseconds === null &&
    timeSpan2.endTimeEpochMilliseconds === null
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan.startTimeEpochMilliseconds =
      timeSpan1.startTimeEpochMilliseconds;
    result.trimmedTimeSpan.endTimeEpochMilliseconds = null;
  }
  return result;
}

/*
...............case 9......................
    <------------timeSpan1------------->
    <----------timeSpan2--------------->
*/
export function handleTimeSpanOverlapCase9(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan,
): TimeSpanOverlapCaseResult {
  const result: TimeSpanOverlapCaseResult = {
    wasCase: false,
    trimmedTimeSpan: timeSpan1,
  };
  if (
    timeSpan1.startTimeEpochMilliseconds ===
      timeSpan2.startTimeEpochMilliseconds &&
    timeSpan1.endTimeEpochMilliseconds === timeSpan2.endTimeEpochMilliseconds
  ) {
    result.wasCase = true;
    result.trimmedTimeSpan = {...timeSpan1};
  }
  return result;
}
