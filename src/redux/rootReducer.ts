import {combineReducers} from 'redux';
import ModalState from '../modal/ModalState';
import modalReducer from '../modal/modalReducer';
import InternationalizationState from '../internationalization/InternationalizationState';
import internationalizationReducer from '../internationalization/internationalizationReducer';
import activityReducer from '../activity/activityReducer';
import {ActivityState} from '../activity/ActivityState';

export interface ApplicationState {
  activity: ActivityState;
  modal: ModalState;
  internationalization: InternationalizationState;
}

export default combineReducers({
  activity: activityReducer,
  modal: modalReducer,
  internationalization: internationalizationReducer,
});
