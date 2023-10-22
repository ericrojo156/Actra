import {BaseAction} from '../types';
import {FlashMessageProps} from './FeedbackState';
export const FEEDBACK_MESSAGE_INVOKED = 'feedback_message_invoked';
export const FEEDBACK_MESSAGE_CLEARED = 'feedback_message_cleared';

export type FeedbackType = 'info' | 'error';

export interface FeedbackMessageAction extends BaseAction {
  payload: FlashMessageProps;
}

export const feedbackMessageInvoked = (
  payload: FlashMessageProps,
): FeedbackMessageAction => {
  return {
    type: FEEDBACK_MESSAGE_INVOKED,
    payload: payload,
  };
};

export const feedbackMessageCleared = () => {
  return {
    type: FEEDBACK_MESSAGE_CLEARED,
  };
};
