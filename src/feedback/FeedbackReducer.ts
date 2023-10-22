import {produce} from 'immer';
import {BaseAction} from '../types';
import {
  FEEDBACK_MESSAGE_INVOKED,
  FeedbackMessageAction,
  FEEDBACK_MESSAGE_CLEARED,
} from './FeedbackActions';
import {FeedbackState, defaultFeedbackState} from './FeedbackState';

export default function FeedbackReducer(
  feedbackState: FeedbackState = defaultFeedbackState,
  action: BaseAction,
) {
  switch (action.type) {
    case FEEDBACK_MESSAGE_INVOKED:
      return produce(feedbackState, (draft: FeedbackState) => {
        const flashMessage = (action as FeedbackMessageAction).payload;
        draft.messages.push({...flashMessage});
      });
    case FEEDBACK_MESSAGE_CLEARED:
      return {...defaultFeedbackState};
    default:
      return feedbackState;
  }
}
