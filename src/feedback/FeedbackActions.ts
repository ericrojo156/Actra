import {AnyAction} from 'redux';
import {BaseAction} from '../types';
export const FEEDBACK_MESSAGE_INVOKED = 'feedback_message_invoked';
export const FEEDBACK_MESSAGE_CLEARED = 'feedback_message_cleared';

export type FeedbackType = 'info' | 'error';

export interface FeedbackMessagePayload {
  message: string;
  secondaryMessage: string;
  type?: FeedbackType;
  undoAction?: AnyAction;
}

export interface FeedbackMessageAction extends BaseAction {
  payload: FeedbackMessagePayload;
}

export const feedbackMessageInvoked = (
  payload: FeedbackMessagePayload,
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
