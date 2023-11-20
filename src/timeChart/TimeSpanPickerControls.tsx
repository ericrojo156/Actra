import React from 'react';
import {View} from 'react-native';
import {TimeSpan} from '../time/types';
import * as ColorPalette from '../ColorPalette';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  calculateTimeUntilNext7AM,
  get24HoursMilliseconds,
  getDuration,
  getTimeSpanSincePrevious7AM,
} from '../time/utils';

export interface TimeSpanPickerControlsProps extends TimeSpan {
  setTimeSpan: (timeSpan: TimeSpan, limitEndTimeToNow?: boolean) => void;
}

const CHEVRON_SIZE = 40;

export const TimeSpanPickerControls = React.memo(
  (props: TimeSpanPickerControlsProps) => {
    const {startTimeEpochMilliseconds, endTimeEpochMilliseconds, setTimeSpan} =
      props;
    const timeSpan = {
      startTimeEpochMilliseconds,
      endTimeEpochMilliseconds,
    };
    const onChangeCalendarPicker = (
      _event: DateTimePickerEvent,
      date?: Date,
    ) => {
      if (!date) {
        return;
      }
      const startTimeEpochMilliseconds = date.getTime();
      const endTimeEpochMilliseconds =
        startTimeEpochMilliseconds > getDuration(getTimeSpanSincePrevious7AM())
          ? startTimeEpochMilliseconds + get24HoursMilliseconds()
          : null;
      setTimeSpan({
        startTimeEpochMilliseconds,
        endTimeEpochMilliseconds,
      });
    };
    const scrollTimeSpanBack = (timeSpan: TimeSpan): TimeSpan => {
      const updatedTimeSpan: TimeSpan = {
        startTimeEpochMilliseconds:
          timeSpan.startTimeEpochMilliseconds - get24HoursMilliseconds(),
        endTimeEpochMilliseconds:
          (timeSpan.endTimeEpochMilliseconds ??
            Date.now() + calculateTimeUntilNext7AM()) -
          get24HoursMilliseconds(),
      };
      return updatedTimeSpan;
    };
    const scrollTimeSpanForward = (timeSpan: TimeSpan): TimeSpan => {
      if (timeSpan.endTimeEpochMilliseconds === null) {
        return {...timeSpan};
      }
      const updatedEndTime =
        timeSpan.endTimeEpochMilliseconds + get24HoursMilliseconds();
      let updatedTimeSpan: TimeSpan = {
        startTimeEpochMilliseconds:
          timeSpan.startTimeEpochMilliseconds + get24HoursMilliseconds(),
        endTimeEpochMilliseconds: updatedEndTime,
      };
      const todayTimeSpan = getTimeSpanSincePrevious7AM();
      if (
        updatedTimeSpan.endTimeEpochMilliseconds !== null &&
        updatedTimeSpan.endTimeEpochMilliseconds >= Date.now()
      ) {
        return todayTimeSpan;
      }
      return updatedTimeSpan;
    };
    const shouldDisallowScrollTimeSpanForward =
      timeSpan.endTimeEpochMilliseconds === null;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialCommunityIcons
          onPress={() => setTimeSpan(scrollTimeSpanBack(timeSpan))}
          name="chevron-left"
          color={ColorPalette.OffWhite_RGBSerialized}
          size={CHEVRON_SIZE}
        />
        <DateTimePicker
          value={new Date(timeSpan.startTimeEpochMilliseconds)}
          display="default"
          mode="date"
          onChange={onChangeCalendarPicker}
          themeVariant="dark"
          maximumDate={new Date()}
        />
        {shouldDisallowScrollTimeSpanForward ? (
          <View style={{width: CHEVRON_SIZE}} />
        ) : (
          <MaterialCommunityIcons
            onPress={() => setTimeSpan(scrollTimeSpanForward(timeSpan))}
            name="chevron-right"
            color={ColorPalette.OffWhite_RGBSerialized}
            size={CHEVRON_SIZE}
          />
        )}
      </View>
    );
  },
);
