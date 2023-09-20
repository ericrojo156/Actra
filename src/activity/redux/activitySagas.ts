import {ParentChildAction} from '../../redux/actions';
import {put, takeLatest} from 'redux-saga/effects';
import {
  ActivityFormData,
  ADDED_CREATED_SUBACTIVITY,
  createdActivity,
  addedSubactivity,
} from './activityActions';

function* addAndCreateSubactivity(action: ParentChildAction<ActivityFormData>) {
  const {parentId, child} = action.payload;
  yield put(createdActivity(child));
  yield put(addedSubactivity(parentId, child.id));
}

export default function* rootSaga() {
  yield takeLatest(ADDED_CREATED_SUBACTIVITY, addAndCreateSubactivity);
}
