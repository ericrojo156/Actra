import React from 'react';
import {View, Text} from 'react-native';
import {useTranslation} from '../internationalization/useTranslation';
import {styles} from '../interval/IntervalElement';
import {MillisecondsProps, useTimeString} from './useTimeString';

export const TimeDisplay = React.memo(function (props: MillisecondsProps) {
  const {milliseconds} = props;
  const {toDurationString} = useTimeString();
  const {translate} = useTranslation();
  if (milliseconds === null) {
    return (
      <View>
        <Text style={{...styles.textStyle}}>{translate('Now')}</Text>
      </View>
    );
  }
  const timeDisplayString = toDurationString(milliseconds);
  return <Text style={styles.textStyle}>{timeDisplayString}</Text>;
});

export const DateTimeDisplay = React.memo(function (props: MillisecondsProps) {
  const {milliseconds} = props;
  const {toDateTimeString} = useTimeString();
  const {translate} = useTranslation();
  if (milliseconds === null) {
    return (
      <View>
        <Text style={{...styles.textStyle}}>{translate('Now')}</Text>
      </View>
    );
  }
  const {date, time} = toDateTimeString(milliseconds);
  return (
    <View>
      <Text style={{...styles.textStyle, fontSize: 15}}>{date}</Text>
      <Text style={{...styles.textStyle, fontSize: 15}}>{time}</Text>
    </View>
  );
});
