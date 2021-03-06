import {TimeSpan} from './types';

export function getDuration(timeSpan: TimeSpan | null): number {
  if (timeSpan === null) {
    return 0;
  }
  return (
    (timeSpan?.endTimeEpochMilliseconds ?? Date.now()) -
    (timeSpan?.startTimeEpochMilliseconds ?? Date.now())
  );
}

export function millisecondsToTime(milliseconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  if (milliseconds < 0) {
    throw new Error('Input must be a non-negative number of milliseconds');
  }

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(milliseconds / 3600000);
  const remainingMilliseconds = milliseconds % 3600000;
  const minutes = Math.floor(remainingMilliseconds / 60000);
  const seconds = Math.floor((remainingMilliseconds % 60000) / 1000);

  const timeObject = {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };

  return timeObject;
}

export function calculateMillisecondsSince7AM(): number {
  // Get the current date and time
  const now = new Date();

  // Check if the current time is between 12:00 AM and 7:00 AM
  if (now.getHours() >= 0 && now.getHours() < 7) {
    // If it's between 12:00 AM and76:00 AM, calculate time since 7 AM of the previous day
    const previousDay = new Date(now);
    previousDay.setDate(now.getDate() - 1);
    previousDay.setHours(7, 0, 0, 0);

    const millisecondsSince6AM: number = now.getTime() - previousDay.getTime();

    return millisecondsSince6AM;
  } else {
    // If it's after 7:00 AM, calculate time since 7 AM today
    const today = new Date(now);
    today.setHours(7, 0, 0, 0);

    const millisecondsSince7AM: number = now.getTime() - today.getTime();

    return millisecondsSince7AM;
  }
}

export function calculateTimeUntilNext7AM(): number {
  // Get the current date and time
  const now = new Date();

  // Check if the current time is before 7 AM
  if (now.getHours() < 7) {
    // If it's before 7 AM, calculate time until 7 AM today
    const next7AM = new Date(now);
    next7AM.setHours(7, 0, 0, 0);

    const millisecondsUntil7AM: number = next7AM.getTime() - now.getTime();

    return millisecondsUntil7AM;
  } else {
    // If it's after 7 AM, calculate time until 7 AM of the next day
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);
    nextDay.setHours(7, 0, 0, 0);

    const millisecondsUntil7AM: number = nextDay.getTime() - now.getTime();

    return millisecondsUntil7AM;
  }
}

export function getTimeSpanSincePrevious7AM(): TimeSpan {
  return {
    startTimeEpochMilliseconds: Date.now() - calculateMillisecondsSince7AM(),
    endTimeEpochMilliseconds: null,
  };
}

export function getOneWeekTimeSpan(): TimeSpan {
  return {
    startTimeEpochMilliseconds: Date.now() - 1000 * 60 * 60 * 24 * 7,
    endTimeEpochMilliseconds: null,
  };
}

export function getOneWeekTimeSpanExcludingToday(): TimeSpan {
  return {
    startTimeEpochMilliseconds: getOneWeekTimeSpan().startTimeEpochMilliseconds,
    endTimeEpochMilliseconds: Date.now() - 1000 * 60 * 60 * 24,
  };
}

export function get24HoursMilliseconds() {
  return 1000 * 60 * 60 * 24;
}

export function getDefaultTimeSpan(): TimeSpan {
  return getTimeSpanSincePrevious7AM();
}

export interface TimeObject {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export function toTimeObject(totalMilliseconds: number): TimeObject {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * secondsPerMinute;
  const secondsPerDay = 24 * secondsPerHour;
  const days = Math.floor(totalSeconds / secondsPerDay);
  const hours = Math.floor((totalSeconds % secondsPerDay) / secondsPerHour);
  const minutes = Math.floor(
    (totalSeconds % secondsPerHour) / secondsPerMinute,
  );
  const remainingSeconds = totalSeconds % secondsPerMinute;
  return {
    days,
    hours,
    mins: minutes,
    secs: remainingSeconds,
  };
}
