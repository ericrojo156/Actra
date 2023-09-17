import {useCallback} from 'react';
import {useTranslation} from '../internationalization/useTranslation';

const resolveTranslationKey = (key: string, value: number): string => {
  // Replace this with your actual translation logic
  // You might use a library like i18next for translations
  switch (key) {
    case 'day': {
      return value === 1 ? 'day' : 'days';
    }
    case 'hour': {
      return value === 1 ? 'hour' : 'hours';
    }
    case 'minute': {
      return value === 1 ? 'minute' : 'minutes';
    }
    case 'second': {
      return value === 1 ? 'second' : 'seconds';
    }
    default: {
      return key;
    }
  }
};

interface TimeStringOut {
  toDateTimeString: (epoch: number) => {date: string; time: string};
  toDurationString: (totalMilliseconds: number) => string;
}

export function useTimeString(): TimeStringOut {
  const {translate, locale} = useTranslation();
  const toDurationString = useCallback(
    (totalMilliseconds: number): string => {
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

      const timeStringParts = [];

      if (days > 0) {
        timeStringParts.push(
          `${days} ${translate(resolveTranslationKey('day', days))}`,
        );
      }
      if (hours > 0) {
        timeStringParts.push(
          `${hours} ${translate(resolveTranslationKey('hour', hours))}`,
        );
      }
      if (minutes > 0) {
        timeStringParts.push(
          `${minutes} ${translate(resolveTranslationKey('minute', minutes))}`,
        );
      }
      if (remainingSeconds > 0) {
        timeStringParts.push(
          `${remainingSeconds} ${translate(
            resolveTranslationKey('second', remainingSeconds),
          )}`,
        );
      }

      return timeStringParts.join(', ');
    },
    [translate],
  );
  const toDateTimeString = useCallback(
    (epochMs: number): {date: string; time: string} => {
      const date = new Date(epochMs);

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };

      const dateTimeString = new Intl.DateTimeFormat(locale, options).format(
        date,
      );
      const split = dateTimeString.split(', ');
      return {
        date: `${split[0]}, ${split[1]}`,
        time: split[2],
      };
    },
    [locale],
  );
  return {
    toDateTimeString,
    toDurationString,
  };
}
