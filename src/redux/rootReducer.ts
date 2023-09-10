import {combineReducers} from 'redux';
import ModalState from '../modal/ModalState';
import modalReducer from '../modal/modalReducer';
import InternationalizationState from '../internationalization/InternationalizationState';
import internationalizationReducer from '../internationalization/internationalizationReducer';

export interface ApplicationState {
  modal: ModalState;
  internationalization: InternationalizationState;
}

export default combineReducers({
  modal: modalReducer,
  internationalization: internationalizationReducer,
});
