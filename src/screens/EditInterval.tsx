import React, {useState} from 'react';
import {NavigationScreenProps} from '../types';
import {useTranslation} from '../internationalization/useTranslation';
import {Text, View} from 'react-native';
import {commonStyles} from '../commonStyles';
import {Interval} from '../interval/types';
import GradientBackground from './GradientBackground';

interface DateTimePickerProps {
  label: string;
  epochMilliseconds: number | null;
  setEpochMilliseconds: (value: number) => void;
}

function DateTimePicker(props: DateTimePickerProps) {
  const {label} = props;
  return (
    <View>
      <Text style={{...commonStyles.textStyle, fontSize: 25}}>{label}</Text>
    </View>
  );
}

export function EditInterval(
  props: NavigationScreenProps<{interval: Interval | null}>,
) {
  const {interval} = props.route.params;
  const {translate} = useTranslation();
  const [startTimeEpochMilliseconds, setStartTimeEpochMilliseconds] = useState<
    number | null
  >(interval?.startTimeEpochMilliseconds ?? Date.now());
  const [endTimeEpochMilliseconds, setEndTimeEpochMilliseconds] = useState<
    number | null
  >(interval?.endTimeEpochMilliseconds ?? Date.now());
  const headerText = translate('Edit-Interval');
  return (
    <GradientBackground>
      <Text style={{...commonStyles.headerTextStyle}}>{headerText}</Text>
      <DateTimePicker
        label={translate('Start-Time')}
        epochMilliseconds={startTimeEpochMilliseconds}
        setEpochMilliseconds={setStartTimeEpochMilliseconds}
      />
      <DateTimePicker
        label={translate('End-Time')}
        epochMilliseconds={endTimeEpochMilliseconds}
        setEpochMilliseconds={setEndTimeEpochMilliseconds}
      />
    </GradientBackground>
  );
}
