import {BaseAction} from '../types';
import {Language} from './useTranslation';
import InternationalizationState from './InternationalizationState';

const defaultInternationalizationState = {
  language: Language.ENGLISH,
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
