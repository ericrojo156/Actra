import React, {useCallback} from 'react';
import {View} from 'react-native';
import PressableIcon from '../components/PressableIcon';
import {IdProp} from '../types';
import {useDispatch, useSelector} from 'react-redux';
import {startedActivity, stoppedActivity} from './redux/activityActions';
import {ApplicationState} from '../redux/rootReducer';
import {StyleSheet} from 'react-native';

const TIMER_BUTTON_ACTIVE_SCALE = 1.25;
const PRESS_ANIMATION_DURATION = 250;

function PlayButton(props: IdProp) {
  const {id} = props;
  const dispatch = useDispatch();
  const onPressPlay = useCallback(() => {
    setTimeout(() => {
      dispatch(startedActivity(id, null));
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
  const {id} = props;
  const currentlyActive = useSelector(
    (state: ApplicationState) => state.interval.currentlyActive,
  );
  const dispatch = useDispatch();
  const onPressStop = useCallback(() => {
    setTimeout(() => {
      dispatch(stoppedActivity(id, currentlyActive));
    }, PRESS_ANIMATION_DURATION);
  }, [currentlyActive, dispatch, id]);
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
