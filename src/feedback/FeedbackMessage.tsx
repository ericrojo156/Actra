import React, {useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {ApplicationState} from '../redux/RootReducer';
import {feedbackMessageCleared} from './FeedbackActions';
import * as ColorPalette from '../ColorPalette';

export const FEEDBACK_MESSAGE_DURATION_MS = 3500;

const bannerBackgroundColors = new Map([
  ['info', ColorPalette.infoMessage],
  ['error', ColorPalette.errorMessage],
]);

export function FeedbackMessage() {
  // note: might as well destructure them from one selector, since these properties are updated all together in one action for feedback messaging
  const {message, secondaryMessage, feedbackType, undoAction} = useSelector(
    (state: ApplicationState) => state.feedback,
  );
  const dispatch = useDispatch();
  const shouldShowMessage = message || secondaryMessage;
  useEffect(() => {
    if (shouldShowMessage) {
      setTimeout(() => {
        dispatch(feedbackMessageCleared());
      }, FEEDBACK_MESSAGE_DURATION_MS);
    }
  }, [dispatch, shouldShowMessage]);
  const onPress = useCallback(() => {
    if (undoAction) {
      dispatch(undoAction);
      dispatch(feedbackMessageCleared());
    }
  }, [dispatch, undoAction]);
  return (
    <>
      {shouldShowMessage && (
        <Pressable
          onPress={onPress}
          style={{
            ...styles.feedbackMessageContainer,
            backgroundColor: bannerBackgroundColors.get(feedbackType),
          }}>
          <Text style={styles.feedbackMessageText}>{message}</Text>
          <View style={{height: 10}} />
          <Text style={styles.feedbackMessageText}>{secondaryMessage}</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  feedbackMessageContainer: {
    paddingTop: 20,
    zIndex: 100,
    flexDirection: 'column',
    alignItems: 'center',
    height: 110,
    width: '100%',
  },
  feedbackMessageText: {color: 'white', fontSize: 20, textAlign: 'center'},
});
