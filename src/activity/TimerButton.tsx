import React, {useCallback} from 'react';
import {View} from 'react-native';
import PressableIcon from '../components/PressableIcon';
import {IdProp} from '../types';
import {useDispatch, useSelector} from 'react-redux';
import activityActions from './redux/activityActions';
import {ApplicationState} from '../redux/rootReducer';
import {StyleSheet} from 'react-native';
import {Interval} from '../interval/types';

const TIMER_BUTTON_ACTIVE_SCALE = 1.25;
const PRESS_ANIMATION_DURATION = 250;

function PlayButton(props: IdProp) {
  const {id} = props;
  const dispatch = useDispatch();
  const onPressPlay = useCallback(() => {
    setTimeout(() => {
      dispatch(activityActions.startActivity.request(id));
    }, PRESS_ANIMATION_DURATION);
  }, [dispatch, id]);
  return (
    <PressableIcon
      customActiveScale={TIMER_BUTTON_ACTIVE_SCALE}
      onPress={() => onPressPlay()}
      iconName="play"
    />
  );
}

function StopButton(props: IdProp) {
  const {id: activityIdToStop} = props;
  const intervalToStop: Interval | null = useSelector(
    (state: ApplicationState) => {
      const currentlyActiveIntervalId = state.interval.currentlyActive;
      return (
        state.interval.activitiesIntervals
          .get(activityIdToStop)
          ?.get(currentlyActiveIntervalId) ?? null
      );
    },
  );
  const dispatch = useDispatch();
  const onPressStop = useCallback(() => {
    setTimeout(() => {
      if (intervalToStop !== null) {
        dispatch(activityActions.stopActivity.request(intervalToStop));
      }
    }, PRESS_ANIMATION_DURATION);
  }, [dispatch, intervalToStop]);
  return (
    <PressableIcon
      customActiveScale={TIMER_BUTTON_ACTIVE_SCALE}
      onPress={() => onPressStop()}
      iconName="stop"
    />
  );
}

export default function TimerButton(props: IdProp) {
  const {id} = props;
  const isActive = useSelector(
    (state: ApplicationState) => state.activity.currentlyActive === id,
  );
  return (
    <View style={styles.timerButton}>
      {isActive ? <StopButton id={id} /> : <PlayButton id={id} />}
    </View>
  );
}

const styles = StyleSheet.create({
  timerButton: {
    transform: [{scale: 1.35}],
  },
});
