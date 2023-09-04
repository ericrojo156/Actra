import {
  DELETE_ACTIVITY_OPTION_INVOKED,
  JOIN_ACTIVITY_OPTION_INVOKED,
  EDIT_ACTIVITY_OPTION_INVOKED,
  HISTORY_ACTIVITY_OPTION_INVOKED,
  IdAction,
  ADD_SUBACTIVITY_OPTION_INVOKED,
} from './actions';
import {takeLatest} from 'redux-saga/effects';

function* deleteActivitySaga(action: IdAction) {
  try {
    const id = action.payload;
    console.log(`delete activity ${id}`);
  } catch (error) {
    console.log(`delete activity saga error: ${error}`);
  }
}
function* joinActivitySaga(action: IdAction) {
  try {
    const id = action.payload;
    console.log(`join activity ${id}`);
  } catch (error) {
    console.log(`join activity saga error: ${error}`);
  }
}
function* editActivitySaga(action: IdAction) {
  try {
    const id = action.payload;
    console.log(`edit activity ${id}`);
  } catch (error) {
    console.log(`edit activity saga error: ${error}`);
  }
}
function* historyActivitySaga(action: IdAction) {
  try {
    const id = action.payload;
    console.log(`history activity ${id}`);
  } catch (error) {
    console.log(`history activity saga error: ${error}`);
  }
}

function* addSubactivityOptionInvokedSaga(action: IdAction) {
  try {
    const id = action.payload;
    console.log(`add subactivity saga: ${id}`);
  } catch (error) {
    console.log(`add subactivity saga error: ${error}`);
  }
}

export default function* rootSaga() {
  yield takeLatest(DELETE_ACTIVITY_OPTION_INVOKED, deleteActivitySaga);
  yield takeLatest(JOIN_ACTIVITY_OPTION_INVOKED, joinActivitySaga);
  yield takeLatest(EDIT_ACTIVITY_OPTION_INVOKED, editActivitySaga);
  yield takeLatest(HISTORY_ACTIVITY_OPTION_INVOKED, historyActivitySaga);
  yield takeLatest(
    ADD_SUBACTIVITY_OPTION_INVOKED,
    addSubactivityOptionInvokedSaga,
  );
}
