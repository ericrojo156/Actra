import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {ParentChildAction, ParentChildrenAction} from '../../redux/actions';
import {
  IntervalAction,
  deletedInterval,
  joinIntervalsToActivity,
} from '../../interval/redux/intervalsActions';
import {
  ActivityFormData,
  ADDED_CREATED_SUBACTIVITY,
  createdActivity,
  addedSubactivities,
  JOINED_ACTIVITIES,
  STARTED_ACTIVITY,
  STOPPED_ACTIVITY,
  stopActivity,
  startActivity,
  deletedActivities,
  clearSelectedActivities,
  addSubactivitiesRequested,
  ADD_SUBACTIVITIES_REQUESTED,
  CombinedActivitiesAction,
  stoppedActivity,
} from './activityActions';
import {uuidv4} from '../../utils/uuid';
import {ApplicationState} from '../../redux/rootReducer';
import {IdType} from '../../types';
import {storeSaveRequested} from '../../store/redux/storeActions';

function* startActivitySaga(action: IntervalAction): any {
  const previouslyActiveActivity = yield select(
    (state: ApplicationState) => state.activity.currentlyActive,
  );
  const previouslyActiveInterval = yield select(
    (state: ApplicationState) => state.interval.currentlyActive,
  );
  if (previouslyActiveActivity !== null && previouslyActiveInterval !== null) {
    yield put(stopActivity(previouslyActiveActivity, previouslyActiveInterval));
  }
  yield put(
    startActivity(action.payload.activityId, action.payload.intervalId),
  );
  yield put(storeSaveRequested());
}

function* stopActivitySaga(action: IntervalAction): any {
  const {activityId, intervalId} = action.payload;
  yield put(stopActivity(activityId, intervalId));
  const interval = yield select((state: ApplicationState) =>
    state.interval.activitiesIntervals.get(activityId)?.get(intervalId),
  );
  const duration =
    interval.endTimeEpochMilliseconds - interval.startTimeEpochMilliseconds;
  if (duration < 1000) {
    // if the duration is less than a second, then don't bother with the interval... delete it from the store
    yield put(deletedInterval(interval, false));
  }
  yield put(storeSaveRequested());
}

function* addSubactivitiesSaga(action: ParentChildrenAction) {
  const {parentId, children: selectedIds} = action.payload;
  const parentIsActive: boolean = yield select(
    (state: ApplicationState) => state.activity.currentlyActive === parentId,
  );
  if (parentIsActive) {
    const currentlyActiveInterval: IdType = yield select(
      (state: ApplicationState) => state.interval.currentlyActive,
    );
    yield put(stoppedActivity(parentId, currentlyActiveInterval));
  }
  yield put(addedSubactivities(parentId, selectedIds));
  yield put(clearSelectedActivities());
  yield put(storeSaveRequested());
}

function* createAndAddSubactivitySaga(
  action: ParentChildAction<ActivityFormData>,
) {
  const {parentId, child} = action.payload;
  yield put(createdActivity(child));
  const selectedIds: IdType[] = yield select(
    (state: ApplicationState): IdType[] => [
      ...state.activity.selectedActivitiesIds.values(),
    ],
  );
  yield put(addSubactivitiesRequested(parentId, [child.id, ...selectedIds]));
  yield put(storeSaveRequested());
}

function* joinActivities(action: CombinedActivitiesAction) {
  const {targetParentId, ids} = action.payload;
  const nameOfCombinedActivity: string = yield select(
    (state: ApplicationState) =>
      state.activity.activities.getData(ids[0] ?? null)?.name ?? '',
  );
  const combinedActivityId = uuidv4();
  yield put(
    createdActivity({
      id: combinedActivityId,
      name: nameOfCombinedActivity,
    }),
  );
  yield put(addedSubactivities(targetParentId, [combinedActivityId]));
  yield put(joinIntervalsToActivity(combinedActivityId, ids));
  yield put(deletedActivities(ids));
  yield put(storeSaveRequested());
}

export default function* rootSaga() {
  yield takeLatest(ADD_SUBACTIVITIES_REQUESTED, addSubactivitiesSaga);
  yield takeLatest(STARTED_ACTIVITY, startActivitySaga);
  yield takeLatest(STOPPED_ACTIVITY, stopActivitySaga);
  yield takeEvery(JOINED_ACTIVITIES, joinActivities);
  yield takeLatest(ADDED_CREATED_SUBACTIVITY, createAndAddSubactivitySaga);
}
