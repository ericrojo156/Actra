import {combineReducers} from 'redux';
import ModalState from '../modal/ModalState';
import modalReducer from '../modal/modalReducer';
import InternationalizationState from '../internationalization/InternationalizationState';
import internationalizationReducer from '../internationalization/internationalizationReducer';
import activityReducer from '../activity/redux/activityReducer';
import {ActivityState} from '../activity/redux/ActivityState';
import intervalReducer from '../interval/intervalReducer';
import {IntervalState} from '../interval/IntervalState';

export interface ApplicationState {
  interval: IntervalState;
  activity: ActivityState;
  modal: ModalState;
  internationalization: InternationalizationState;
}

export default combineReducers({
  interval: intervalReducer,
  activity: activityReducer,
  modal: modalReducer,
  internationalization: internationalizationReducer,
});
