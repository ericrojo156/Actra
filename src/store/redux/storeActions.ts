import {BaseAction} from '../../types';

export const STORE_LOAD_REQUESTED = 'STORE_LOAD_REQUESTED';
export const STORE_SAVE_REQUESTED = 'STORE_SAVE_REQUESTED';

export const storeLoadRequested = (): BaseAction => ({
  type: STORE_LOAD_REQUESTED,
});

export const storeSaveRequested = (): BaseAction => {
  return {
    type: STORE_SAVE_REQUESTED,
  };
};
