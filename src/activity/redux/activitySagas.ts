import {ParentChildAction} from '../../redux/actions';
import {put, takeLatest} from 'redux-saga/effects';
import {
  ActivityFormData,
  ADDED_CREATED_SUBACTIVITY,
  createdActivity,
  addedSubactivities,
} from './activityActions';

function* createAndAddSubactivity(action: ParentChildAction<ActivityFormData>) {
  const {parentId, child} = action.payload;
  yield put(createdActivity(child));
  yield put(addedSubactivities(parentId, [child.id]));
}

export default function* rootSaga() {
  yield takeLatest(ADDED_CREATED_SUBACTIVITY, createAndAddSubactivity);
}
