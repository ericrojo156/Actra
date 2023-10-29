import {AnyAction} from 'redux';

export type FeedbackType = 'info' | 'error';

export interface FlashMessageProps {
  message: string;
  secondaryMessage?: string;
  feedbackType: FeedbackType;
  undoAction: AnyAction | null;
}

export interface FeedbackState {
  messages: FlashMessageProps[];
}

export const defaultFeedbackState: FeedbackState = {
  messages: [],
};
