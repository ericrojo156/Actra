import React, {useCallback, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, View, Text, Pressable, Animated} from 'react-native';
import {ApplicationState} from '../redux/RootReducer';
import {feedbackMessageCleared} from './FeedbackActions';
import * as ColorPalette from '../ColorPalette';
import {FlashMessageProps} from './FeedbackState';

export const FEEDBACK_MESSAGE_DURATION_MS = 3500;
const CLOSED_POSITION = 1000;
const OPENED_POSITION = 730;

const bannerBackgroundColors = new Map([
  ['info', ColorPalette.infoMessage],
  ['error', ColorPalette.errorMessage],
]);

function animateY(initialY: Animated.Value, toValue: number) {
  const duration = 200;
  Animated.timing(initialY, {
    toValue,
    duration: duration,
    useNativeDriver: true,
  }).start();
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export const emptyMessage: FlashMessageProps = {
  message: '',
  secondaryMessage: '',
  feedbackType: 'info',
  undoAction: null,
};

export function FlashMessageBanner() {
  // note: might as well destruct them from one selector, since these properties are updated all together in one action for feedback messaging
  const messagesArray = useSelector(
    (state: ApplicationState) => state.feedback.messages,
  );
  const latestMessage =
    (messagesArray.length > 0 && messagesArray[messagesArray.length - 1]) ||
    emptyMessage;
  const {message, secondaryMessage, feedbackType} = latestMessage;
  const dispatch = useDispatch();
  const shouldShowMessage = message || secondaryMessage;
  const yPosition = useRef(new Animated.Value(CLOSED_POSITION)).current;
  const closeFlashMessage = useCallback(async () => {
    dispatch(feedbackMessageCleared());
    await animateY(yPosition, CLOSED_POSITION);
  }, [dispatch, yPosition]);
  useEffect(() => {
    if (shouldShowMessage) {
      animateY(yPosition, OPENED_POSITION).then(() => {
        setTimeout(() => {
          closeFlashMessage();
        }, FEEDBACK_MESSAGE_DURATION_MS);
      });
    }
  }, [closeFlashMessage, dispatch, shouldShowMessage, yPosition]);
  const onPress = useCallback(async () => {
    closeFlashMessage();
    messagesArray.forEach(messageProps => {
      const undoAction = messageProps.undoAction;
      if (undoAction) {
        dispatch(undoAction);
      }
    });
  }, [closeFlashMessage, dispatch, messagesArray]);
  return (
    <Animated.View
      style={{
        ...styles.feedbackMessageContainer,
        backgroundColor: bannerBackgroundColors.get(feedbackType),
        // @ts-ignore
        transform: [{translateY: yPosition}],
      }}>
      <Pressable onPress={onPress}>
        <Text style={styles.feedbackMessageText}>{message}</Text>
        <View style={{height: 10}} />
        <Text style={styles.feedbackMessageText}>{secondaryMessage}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  feedbackMessageContainer: {
    zIndex: 20,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
    width: '100%',
  },
  feedbackMessageText: {color: 'white', fontSize: 22, textAlign: 'center'},
});
