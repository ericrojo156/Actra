import {AnyAction} from 'redux';

export type FeedbackType = 'info' | 'error';

export interface FeedbackState {
  message: string;
  secondaryMessage: string;
  feedbackType: FeedbackType;
  undoAction: AnyAction | null;
}

export const defaultFeedbackState: FeedbackState = {
  message: '',
  secondaryMessage: '',
  feedbackType: 'info',
  undoAction: null,
};
