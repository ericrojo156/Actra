import {put, takeLatest} from 'redux-saga/effects';
import {
  EDITED_INTERVAL,
  IntervalAction,
  editInterval,
} from './intervalsActions';
import {storeSaveRequested} from '../../store/redux/storeActions';

function* editIntervalSaga(action: IntervalAction) {
  const interval = action.payload;
  yield put(editInterval(interval));
  yield put(storeSaveRequested());
}

export default function* rootSaga() {
  yield takeLatest(EDITED_INTERVAL, editIntervalSaga);
}
