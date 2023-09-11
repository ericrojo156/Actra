import {ActiveModalState} from './Modal';
import {ModalParams} from './modalActions';

export default interface ModalState extends ModalParams<any> {
  activeModal: ActiveModalState;
}
