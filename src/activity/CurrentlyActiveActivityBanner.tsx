import React, {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  STANDARD_ELEMENT_WIDTH,
  STANDARD_ELEMENT_HEIGHT,
  SPACE_BETWEEN_ELEMENTS,
} from '../constants';
import {ApplicationState} from '../redux/rootReducer';
import {Activity} from './ActivityElement';
import * as ColorProcessor from '../ColorProcessor';
import * as ColorPalette from '../ColorPalette';
import {StyleSheet} from 'react-native';
import {useCurrentIntervalRealTimeDuration} from '../time/useRealTimeDuration';
import {commonStyles} from '../commonStyles';
import {TimeDisplay} from '../time/TimeDisplay';
import TimerButton from './TimerButton';
import useActivityOptionCallbacks from './useActivityOptionsActions';
import {IdType} from '../types';

function CurrentlyActiveTimeDisplay() {
  const durationMilliseconds = useCurrentIntervalRealTimeDuration();
  return <TimeDisplay milliseconds={durationMilliseconds} />;
}

export function CurrentlyActiveActivityBanner() {
  const activity: Activity | null = useSelector((state: ApplicationState) => {
    const currentlyActiveId = state.activity.currentlyActive;
    if (currentlyActiveId === null) {
      return null;
    }
    return state.activity.activities.getData(currentlyActiveId);
  });
  const {goToActivityHistory: goToActivityHistory} =
    useActivityOptionCallbacks();
  const goToHistory = useCallback(
    (id: IdType) => goToActivityHistory(id),
    [goToActivityHistory],
  );
  if (activity === null) {
    return null;
  }
  const {id, name, color} = activity;
  return (
    <Pressable onPress={() => goToHistory(id)} style={styles.bannerContainer}>
      <View
        style={{
          ...styles.outerContainer,
          backgroundColor: ColorProcessor.serialize(color),
        }}>
        <View style={styles.innerContainer}>
          <Text
            style={{
              ...commonStyles.textStyle,
              ...styles.textStyle,
            }}>
            {name}
          </Text>
          <CurrentlyActiveTimeDisplay />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          transform: [
            {translateX: STANDARD_ELEMENT_WIDTH - SPACE_BETWEEN_ELEMENTS * 4},
            {translateY: STANDARD_ELEMENT_HEIGHT * 0.25},
          ],
        }}>
        <TimerButton id={id} />
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  bannerContainer: {
    zIndex: 100,
  },
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: ColorPalette.SoftBlack_RGBASerialized,
    borderRadius: 5,
    width: STANDARD_ELEMENT_WIDTH * 1.1,
    height: STANDARD_ELEMENT_HEIGHT,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  textStyle: {
    fontSize: 25,
  },
});
