import {BaseAction} from '../types';
import InternationalizationState from './InternationalizationState';

const defaultInternationalizationState: InternationalizationState = {
  locale: 'en-US',
};

export default function internationalizationReducer(
  state: InternationalizationState = defaultInternationalizationState,
  action: BaseAction,
) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
