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

export function calculateMillisecondsSince6AM(): number {
  // Get the current date and time
  const now = new Date();

  // Check if the current time is between 12:00 AM and 6:00 AM
  if (now.getHours() >= 0 && now.getHours() < 6) {
    // If it's between 12:00 AM and 6:00 AM, calculate time since 6 AM of the previous day
    const previousDay = new Date(now);
    previousDay.setDate(now.getDate() - 1);
    previousDay.setHours(6, 0, 0, 0);

    const millisecondsSince6AM: number = now.getTime() - previousDay.getTime();

    return millisecondsSince6AM;
  } else {
    // If it's after 6:00 AM, calculate time since 6 AM today
    const today = new Date(now);
    today.setHours(6, 0, 0, 0);

    const millisecondsSince6AM: number = now.getTime() - today.getTime();

    return millisecondsSince6AM;
  }
}

export function getTimeSpanSincePrevious6AM(): TimeSpan {
  return {
    startTimeEpochMilliseconds: Date.now() - calculateMillisecondsSince6AM(),
    endTimeEpochMilliseconds: null,
  };
}
