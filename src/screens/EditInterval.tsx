import React, {useCallback, useState} from 'react';
import {NavigationScreenProps} from '../types';
import {useTranslation} from '../internationalization/useTranslation';
import {StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../commonStyles';
import {Interval} from '../interval/types';
import GradientBackground from './GradientBackground';
import DateTimePickerRN, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import CustomPressable from '../components/Pressable';
import * as ColorPalette from '../ColorPalette';
import {useDispatch, useSelector} from 'react-redux';
import {editedInterval} from '../interval/redux/intervalsActions';
import {useNavigation} from '@react-navigation/native';
import {ApplicationState} from '../redux/rootReducer';
import {feedbackMessageInvoked} from '../feedback/FeedbackActions';

interface DateTimePickerProps {
  label: string;
  epochMilliseconds: number | null;
  setEpochMilliseconds: (value: number) => void;
}

function DateTimePicker(props: DateTimePickerProps) {
  const {label, epochMilliseconds, setEpochMilliseconds} = props;
  const date = epochMilliseconds ? new Date(epochMilliseconds) : new Date();
  const onChange = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    setEpochMilliseconds((selectedDate ?? date).getTime());
  };
  return (
    <View style={styles.dateTimePickerContainer}>
      <Text style={{...commonStyles.textStyle, fontSize: 25}}>{label}</Text>
      <DateTimePickerRN
        themeVariant="dark"
        mode={'datetime'}
        value={date}
        onChange={onChange}
      />
    </View>
  );
}

export function EditInterval(
  props: NavigationScreenProps<{interval: Interval}>,
) {
  const {interval} = props.route.params;
  const {translate} = useTranslation();
  const [startTimeEpochMilliseconds, setStartTimeEpochMilliseconds] =
    useState<number>(interval?.startTimeEpochMilliseconds ?? Date.now());
  const [endTimeEpochMilliseconds, setEndTimeEpochMilliseconds] = useState<
    number | null
  >(interval?.endTimeEpochMilliseconds ?? null);
  const duration: number =
    (endTimeEpochMilliseconds ?? Date.now()) - startTimeEpochMilliseconds;
  const headerText = translate('Edit-Interval');
  const confirmationText = translate('Save');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isActive = useSelector((state: ApplicationState) => {
    return (
      state.interval.currentlyActive !== null &&
      state.interval.currentlyActive === interval?.intervalId
    );
  });
  const handleSubmit = useCallback(() => {
    if (duration <= 0) {
      dispatch(
        feedbackMessageInvoked({
          feedbackType: 'error',
          message: translate('Start-time-cannot-be-after-end-time'),
          undoAction: null,
        }),
      );
      return;
    }
    if (interval) {
      const updatedInterval: Interval = {
        ...interval,
        startTimeEpochMilliseconds,
        endTimeEpochMilliseconds: !isActive ? endTimeEpochMilliseconds : null,
      };
      dispatch(editedInterval(updatedInterval));
      // @ts-ignore
      navigation.navigate('History', {id: interval.parentActivityId});
    }
  }, [
    duration,
    interval,
    dispatch,
    translate,
    startTimeEpochMilliseconds,
    isActive,
    endTimeEpochMilliseconds,
    navigation,
  ]);
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={{...commonStyles.headerTextStyle}}>{headerText}</Text>
        <View style={styles.inputSection}>
          <DateTimePicker
            label={translate('Start')}
            epochMilliseconds={startTimeEpochMilliseconds}
            setEpochMilliseconds={setStartTimeEpochMilliseconds}
          />
          {!isActive && (
            <DateTimePicker
              label={translate('End')}
              epochMilliseconds={endTimeEpochMilliseconds}
              setEpochMilliseconds={setEndTimeEpochMilliseconds}
            />
          )}
        </View>
        <View style={styles.saveButtonContainer}>
          <CustomPressable style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.buttonTextStyle}>{confirmationText}</Text>
          </CustomPressable>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {padding: 100, flex: 1, alignItems: 'center'},
  inputSection: {
    height: '100%',
    justifyContent: 'center',
    paddingBottom: 200,
  },
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
  saveButtonContainer: {
    transform: [{translateY: -100}],
  },
});
