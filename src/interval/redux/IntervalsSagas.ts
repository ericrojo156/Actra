import {put, takeEvery} from 'redux-saga/effects';
import intervalsActions, {
  DELETE_INTERVAL_REQUESTED,
  DeletedIntervalAction,
  EDIT_INTERVAL_REQUESTED,
  IntervalAction,
  JOIN_INTERVALS_TO_ACTIVITY_REQUESTED,
  JoinActivitiesAction,
  UNDO_INTERVAL_DELETION_REQUESTED,
} from './intervalsActions';
import {storeSaveRequested} from '../../store/redux/storeActions';

function* joinIntervalsToActivitySaga(action: JoinActivitiesAction) {
  const {combinedActivityId, activitiesToJoin} = action.payload;
  yield put(
    intervalsActions.joinIntervalsToActivity.action(
      combinedActivityId,
      activitiesToJoin,
    ),
  );
  yield put(storeSaveRequested());
}

function* deleteIntervalSaga(action: DeletedIntervalAction) {
  const {deletedInterval, wasActive} = action.payload;
  yield put(intervalsActions.deleteInterval.action(deletedInterval, wasActive));
  yield put(storeSaveRequested());
}

function* undoIntervalDeletionSaga(action: DeletedIntervalAction) {
  const {deletedInterval, wasActive} = action.payload;
  yield put(
    intervalsActions.undoDeleteInterval.action(deletedInterval, wasActive),
  );
  yield put(storeSaveRequested());
}

function* editIntervalSaga(action: IntervalAction) {
  const interval = action.payload;
  yield put(intervalsActions.editInterval.action(interval));
  yield put(storeSaveRequested());
}

export default function* rootSaga() {
  yield takeEvery(
    JOIN_INTERVALS_TO_ACTIVITY_REQUESTED,
    joinIntervalsToActivitySaga,
  );
  yield takeEvery(DELETE_INTERVAL_REQUESTED, deleteIntervalSaga);
  yield takeEvery(UNDO_INTERVAL_DELETION_REQUESTED, undoIntervalDeletionSaga);
  yield takeEvery(EDIT_INTERVAL_REQUESTED, editIntervalSaga);
}
