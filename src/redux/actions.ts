import {BaseAction} from '../types';

export interface IdAction extends BaseAction {
  payload: string | null;
}
