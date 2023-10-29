import React, {useCallback, useState} from 'react';
import {NavigationScreenProps} from '../types';
import {useTranslation} from '../internationalization/useTranslation';
import {StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../commonStyles';
import {Interval} from '../interval/types';
import GradientBackground from './GradientBackground';
import DateTimePickerRN from '@react-native-community/datetimepicker';
import CustomPressable from '../components/Pressable';
import * as ColorPalette from '../ColorPalette';
import {useDispatch} from 'react-redux';

interface DateTimePickerProps {
  label: string;
  epochMilliseconds: number | null;
  setEpochMilliseconds: (value: number) => void;
}

function DateTimePicker(props: DateTimePickerProps) {
  const {label, epochMilliseconds} = props;
  const [date, setDate] = useState(
    epochMilliseconds ? new Date(epochMilliseconds) : new Date(),
  );

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <View style={styles.dateTimePickerContainer}>
      <Text style={{...commonStyles.textStyle, fontSize: 25}}>{label}</Text>
      <DateTimePickerRN mode={'datetime'} value={date} onChange={onChange} />
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
  const confirmationText = translate('Save-Changes');
  const dispatch = useDispatch();
  const handleSubmit = useCallback(() => {
    dispatch(editedInterval);
  }, [dispatch]);
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={{...commonStyles.headerTextStyle}}>{headerText}</Text>
        <View style={styles.inputSection}>
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
        </View>
        <CustomPressable style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.buttonTextStyle}>{confirmationText}</Text>
        </CustomPressable>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {padding: 100, flex: 1, alignItems: 'center'},
  inputSection: {paddingTop: 90, paddingBottom: 30},
  dateTimePickerContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: ColorPalette.actionColorSerialized,
    padding: 12,
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonTextStyle: {
    fontSize: 25,
    color: ColorPalette.OffWhite_RGBSerialized,
  },
});
